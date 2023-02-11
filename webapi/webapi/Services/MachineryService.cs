using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.Transactions;
using MongoDB.Bson;
using MongoDB.Driver.GeoJsonObjectModel;
using System.Data.Common;

namespace webapi.Services
{
    public class MachineryService
    {
        private readonly IDbContext _context;
        private readonly ILogger<MachineryService> _logger;
        private readonly FileService _fileService;
        public MachineryService(
            IDbContext context,
            ILogger<MachineryService> logger,
            FileService fileService)
        {
            _context = context;
            _logger = logger;
            _fileService = fileService;
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

        public async Task<bool> DeleteAsync(string userId, string machineId)
        {
            var userFilter = Builders<User>.Filter.Where(u => u.Id == userId);
            var userUpdate = Builders<User>.Update.PullFilter(u => u.Machines, Builders<MachinerySummary>.Filter.Where(m => m.Id.Id == machineId));

            var resultSummary = await _context.Users.UpdateOneAsync(userFilter, userUpdate);

            var machineFilter = Builders<Machinery>.Filter.Eq((m) => m.Id, machineId) &
                Builders<Machinery>.Filter.Eq((m) => m.User.Id, userId);

            var resultMachine = await _context.Machines.FindOneAndDeleteAsync(machineFilter);

            _fileService.DeleteFiles(resultMachine.Images);

            return resultSummary != null;
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

        public async Task<Machinery?> UpdateMachineForUser(string userId, Machinery machine)
        {
            using var session = await _context.MongoClient.StartSessionAsync();
            session.StartTransaction();

            var filter = Builders<Machinery>.Filter.Eq(x => x.Id, machine.Id);
            filter &= Builders<Machinery>.Filter.Eq(x => x.User.Id, userId);

            var updatingMachine = (await _context.Machines.FindAsync(filter)).Single();

            if (updatingMachine == null)
            {
                return null;
            }

            List<string> imagesToDelete = updatingMachine.Images.Where((i) => !machine.Images.Contains(i)).ToList();

            var result = await _context.Machines.ReplaceOneAsync(filter, machine);

            var filterUser = Builders<User>.Filter.Eq((u) => u.Id, userId);
            filterUser &= Builders<User>.Filter.ElemMatch(u => u.Machines, Builders<MachinerySummary>.Filter.Eq((m) => m.Id.Id, machine.Id));

            var update = Builders<User>.Update
                .Set(x => x.Machines.FirstMatchingElement().Model, machine.Model)
                .Set(x => x.Machines.FirstMatchingElement().RegisteredUntil, machine.RegisteredUntil)
                .Set(x => x.Machines.FirstMatchingElement().Type, machine.Type);

            await _context.Users.UpdateOneAsync(filterUser, update);

            await session.CommitTransactionAsync();

            _fileService.DeleteFiles(imagesToDelete);

            return machine;
        }
    }
}
