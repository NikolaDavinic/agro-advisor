using MongoDB.Driver.GeoJsonObjectModel;
using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using MongoDB.Bson;
using System.Transactions;

namespace webapi.Services
{
    public class HarvestService
    {
        private readonly IDbContext _context;
        public HarvestService(IDbContext context)
        {
            _context = context;
        }
        public async Task<Harvest> CreateAsync(HarvestDTO newHarvest, string plotId)
        {
            var harvest = new Harvest
            {
                Amount= newHarvest.Amount,
                CultureName = newHarvest.CultureName,
                Date = newHarvest.Date,
                //CurrentCulture = newHarvest.cu
            };

            var filter = Builders<Plot>.Filter.Eq((p) => p.Id, plotId);
            var update = Builders<Plot>.Update.Push(u => u.Harvests, harvest);

            var result = await _context.Plots.FindOneAndUpdateAsync(filter, update);

            return harvest;
        }

        public async Task<List<Harvest>> GetPlotHarvestsAsync(string plotId)
        {
            var filter = Builders<Plot>.Filter.Eq(x => x.Id, plotId);

            return (await _context.Plots.Find(filter).FirstOrDefaultAsync()).Harvests;
        }

        public async Task<bool> DeleteAsync(string harvestId, string plotId)
        {
            var filter = Builders<Plot>.Filter.Where(u => u.Id == plotId);
            var update = Builders<Plot>.Update.PullFilter(u => u.Harvests, Builders<Harvest>.Filter.Where(t => t.Id == ObjectId.Parse(harvestId)));

            var result = await _context.Plots.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
}
