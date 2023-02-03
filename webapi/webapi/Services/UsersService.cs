using Microsoft.Extensions.Options;
using MongoDB.Driver;
using webapi.Models;

namespace BookStoreApi.Services;

public class UsersService
{
    private readonly DbContext _context;
    public UsersService(DbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAsync() =>
        await _context.Users.Find(_ => true).ToListAsync();

    public async Task<User?> GetAsync(string id) =>
        await _context.Users.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(User newUser) =>
        await _context.Users.InsertOneAsync(newUser);

    public async Task UpdateAsync(string id, User updatedUser) =>
        await _context.Users.ReplaceOneAsync(x => x.Id == id, updatedUser);

    public async Task RemoveAsync(string id) =>
        await _context.Users.DeleteOneAsync(x => x.Id == id);
}