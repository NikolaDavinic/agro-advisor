using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace webapi.Services;

public class UserService
{
    private readonly IDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<UserService> _logger;
    public UserService(
        IDbContext context, 
        IConfiguration config,
        ILogger<UserService> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task<List<User>> GetAsync() =>
        await _context.Users.Find(_ => true).ToListAsync();

    public async Task<User?> GetAsync(string id) =>
        await _context.Users.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(UserDTO newUser)
    {
        //Geo kodiranje korisnikove adrese
        var client = new HttpClient();
        var response = await client.GetAsync($"https://api.maptiler.com/geocoding/${newUser.Address}.json?key=***REMOVED***");
        var responseBody = await response.Content.ReadAsStringAsync();
        dynamic json = JsonConvert.DeserializeObject(responseBody);
        var x = json.features[0].geometry.coordinates[1];
        var y = json.features[0].geometry.coordinates[0];

        await _context.Users.InsertOneAsync(new User
        {
            PasswordHash = HashPassword(newUser.Password),
            Address = newUser.Address,
            Email = newUser.Email,
            Name = newUser.Name,
            AdressPoint = new Point { X = x, Y = y }
        });
    }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.Find(x => x.Email == email).FirstOrDefaultAsync();

    public async Task UpdateAsync(string id, User updatedUser) =>
        await _context.Users.ReplaceOneAsync(x => x.Id == id, updatedUser);

    public async Task RemoveAsync(string id) =>
        await _context.Users.DeleteOneAsync(x => x.Id == id);

    public string CreateToken(User u)
    {
        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.Email, u.Email),
            new Claim(ClaimTypes.Name, u.Name),
            new Claim("Id", u.Id ?? "")
        };

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}