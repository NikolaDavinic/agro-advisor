using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

namespace BookStoreApi.Services;

public class CategoryService
{
    private readonly IDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<CategoryService> _logger;
    public CategoryService(
        IDbContext context,
        IConfiguration config,
        ILogger<CategoryService> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task<List<TransactionCategory>> GetCategoriesForUserAsync(string userId)
    {
        var filter = Builders<TransactionCategory>.Filter.Eq(x => x.User.Id, userId);
        filter |= !Builders<TransactionCategory>.Filter.Exists(x => x.User);

        var result = await _context.TCategories.Find(filter).ToListAsync();
        return result;
    }

    public async Task CreateAsync(TransactionCategory tc) =>
        await _context.TCategories.InsertOneAsync(tc);

    public async Task<TransactionCategory?> GetUserCategory(string userId, string categoryName)
    {
        var filter = Builders<TransactionCategory>.Filter.Eq(x => x.Name, categoryName);
        filter &= (!Builders<TransactionCategory>.Filter.Exists(x => x.User) | Builders<TransactionCategory>.Filter.Eq(x => x.User.Id, userId));

        return (await _context.TCategories.FindAsync(filter)).FirstOrDefault();
    }

    public async Task<TransactionCategory?> GetAsync(string id) => 
        await _context.TCategories.Find(x => x.Id == id).FirstOrDefaultAsync();

    //public async Task UpdateAsync(string id, User updatedUser) =>
    //    await _context.Users.ReplaceOneAsync(x => x.Id == id, updatedUser);

    //public async Task RemoveAsync(string id) =>
    //    await _context.Users.DeleteOneAsync(x => x.Id == id);
}