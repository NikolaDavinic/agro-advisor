using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections;

namespace BookStoreApi.Services;

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

    public async Task AddTransactionForUser(string userId, Transaction transaction)
    {
        var filter = Builders<User>.Filter.Eq((u) => u.Id, userId);
        var update = Builders<User>.Update.Push(e => e.Transactions, transaction);

        var result = await _context.Users.FindOneAndUpdateAsync(filter, update);
        //return transaction;
    }
    //public async Task<List<TransactionCategory>> GetCategoriesForUserAsync(string userId)
    //{
    //    var filter = Builders<TransactionCategory>.Filter.Eq(x => x.User.Id, userId);
    //    filter |= !Builders<TransactionCategory>.Filter.Exists(x => x.User);

    //    var result = await _context.TCategories.Find(filter).ToListAsync();
    //    return result;
    //}

    //public async Task CreateAsync(TransactionCategory tc) =>
    //    await _context.TCategories.InsertOneAsync(tc);


    //public async Task UpdateAsync(string id, User updatedUser) =>
    //    await _context.Users.ReplaceOneAsync(x => x.Id == id, updatedUser);

    //public async Task RemoveAsync(string id) =>
    //    await _context.Users.DeleteOneAsync(x => x.Id == id);

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
        //var pipline = new BsonDocument[]
        //{
        //    new BsonDocument("$group",
        //        new BsonDocument
        //        {
        //            {"_id", new BsonDocument("$year", "$dateField") },
        //            { "value", new BsonDocument("$sum",1) }
        //        }
        //    )
        //};


    }
}