using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Reflection.Emit;
using System.Collections;
using System.Text.RegularExpressions;

namespace webapi.Services;

public class TransactionService
{
    private readonly IDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<TransactionService> _logger;
    public TransactionService(
        IDbContext context,
        IConfiguration config,
        ILogger<TransactionService> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task<Transaction> AddTransactionForUser(string userId, Transaction transaction)
    {
        //var filter = Builders<User>.Filter.Eq((u) => u.Id, userId);
        //var update = Builders<User>.Update.Push(e => e.Transactions, transaction);

        //var result = await _context.Users.FindOneAndUpdateAsync(filter, update);
        //return transaction;

        var filter = Builders<User>.Filter.Eq((u) => u.Id, userId);
        var update = Builders<User>.Update.Push(u => u.Transactions, transaction);

        var result = await _context.Users.FindOneAndUpdateAsync(filter, update);
        return transaction;
    }

    public async Task<Transaction> UpdateUserTransaction(string userId, Transaction transaction)
    {
        var filterBuilder = Builders<User>.Filter;
        var filterUser = filterBuilder.Eq(x => x.Id, userId) &
            filterBuilder.ElemMatch(doc => doc.Transactions, Builders<Transaction>.Filter.Eq(x => x.Id, transaction.Id));

        var updateBuilder = Builders<User>.Update;
        var update = updateBuilder
            .Set(doc => doc.Transactions.FirstMatchingElement().Value, transaction.Value)
            .Set(doc => doc.Transactions.FirstMatchingElement().Date, transaction.Date)
            .Set(doc => doc.Transactions.FirstMatchingElement().Description, transaction.Description)
            .Set(doc => doc.Transactions.FirstMatchingElement().CategoryName, transaction.CategoryName)
            .Set(doc => doc.Transactions.FirstMatchingElement().Category, transaction.Category);


        await _context.Users.UpdateOneAsync(filterUser, update);
        return transaction;
    }

    public async Task<bool> DeleteTransactionForUser(string userId, string transactionId)
    {
        var filter = Builders<User>.Filter.Where(u => u.Id == userId);
        var update = Builders<User>.Update.PullFilter(u => u.Transactions, Builders<Transaction>.Filter.Where(t => t.Id == ObjectId.Parse(transactionId)));

        var result = await _context.Users.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<List<Transaction>> FilterTransactions(string userId, DateTime? before, int? skip, int? take, string? type, string? categoryIds)
    {
        var query = _context.Users.AsQueryable()
            .Where(u => u.Id == userId)
            .Single()
            .Transactions.AsQueryable();
       
        if (before != null)
        {
            query = query.Where(t => t.Date <= before);
        }

        if (type == "priliv")
        {
            query = query.Where(t => t.Value >= 0);
        } else if (type == "rashod")
        {
            query = query.Where(t => t.Value <= 0);
        }

        if (categoryIds != null)
        {
            List<string> ids = categoryIds.Split(",").ToList();
            query = query.Where(t => ids.Contains(t.Category.Id.AsString));
        }

        var result = await query
            .OrderByDescending(t => t.Date)
            .Skip(skip ?? 0)
            .Take(take ?? 10)
            .ToAsyncEnumerable()
            .ToListAsync();

        return result;
    }

    public async Task<IEnumerable> GetTransactionDataForChart(string userId)
    {
        var user = await _context.Users.Find(x => x.Id == userId).FirstOrDefaultAsync();

        var groupedElements = user.Transactions.GroupBy(e => e.Date.Year)
            .Select(g => new
            {
                Date = g.Key,
                Suma = g.Sum(e => e.Value),
                Values = g.Select(el => new
                {
                    Value = el.Value,
                    Date = el.Date
                }).ToList()
            });

        return groupedElements;
    }

    public async Task<IEnumerable> GetTransactionGroupedByYearAndCatergoryName(string userId)
    {
        var result = (await _context.Users.AsQueryable()
            .Where(u => u.Id == userId)
            .SelectMany(u => u.Transactions)
            .Select(u => new { u.Date.Year, u.CategoryName, u.Value })
            .GroupBy(x => x.Year)
            .ToListAsync())
            .Select((group) => new
            {
                Year = group.Key,
                Expense = group.Where(t => t.Value < 0).GroupBy(e => e.CategoryName).Select((e) => new { CategoryName = e.Key, Count = e.Sum(u => -u.Value) }),
                Income = group.Where(t => t.Value >= 0).GroupBy(e => e.CategoryName).Select((e) => new { CategoryName = e.Key, Count = e.Sum(u => u.Value) })
            });

        return result;
    }

}