using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;

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

    public async Task<List<TransactionCategory>> GetCategoriesForUserAsync(string userId) =>
        await _context.TCategories.Find((c) => c.User.Equals(userId) || c.User == null).ToListAsync();

    //public async Task CreateAsync()
    //{
        
    //}

    //public async Task UpdateAsync(string id, User updatedUser) =>
    //    await _context.Users.ReplaceOneAsync(x => x.Id == id, updatedUser);

    //public async Task RemoveAsync(string id) =>
    //    await _context.Users.DeleteOneAsync(x => x.Id == id);
}