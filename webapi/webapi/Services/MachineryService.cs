using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;


namespace webapi.Services
{
    public class MachineryService
    {
        private readonly IDbContext _context;
        private readonly ILogger<MachineryService> _logger;
        public MachineryService(
            IDbContext context,
            ILogger<MachineryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task CreateAsync(string userId, Machinery machine)
        {
            using var session = await _context.MongoClient.StartSessionAsync();

            session.StartTransaction();

            await _context.Machines.InsertOneAsync(machine);

            var filter = Builders<User>.Filter.Eq((u) => u.Id, userId);
            var update = Builders<User>.Update.Push(u => u.Machines, new MachinerySummary
            {
                Id = new MongoDBRef("Machines", machine.Id),
                RegisteredUntil = machine.RegisteredUntil,
                Model = machine.Model,
                Type = machine.Type
            });

            _context.Users.FindOneAndUpdate(filter, update);

            await session.CommitTransactionAsync();
        }

        public async Task<Machinery?> GetMachineForUser(string userId, string machineId)
        {
            var machine = await _context.Machines.AsQueryable()
                .Where((m) => m.Id == machineId && m.User.Id == userId)
                .SingleAsync();

            return machine;
        }

        public async Task<List<MachinerySummary>> GetUserMachineSummaries(string userId)
        {
            var result = await _context.Users.AsQueryable()
                .Where(u => u.Id == userId)
                .Select(u => u.Machines)
                .SingleAsync();

            return result;
        }
    }
}
