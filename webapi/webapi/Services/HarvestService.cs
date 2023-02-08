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
        public async Task CreateAsync(HarvestDTO newHarvest,string plotId)
        {
            var harvest = new Harvest
            {
                Amount= newHarvest.Amount,
                CultureName= newHarvest.CultureName,
                Date=newHarvest.Date
            };

            var filter = Builders<Plot>.Filter.Eq((p) => p.Id, plotId);
            var update = Builders<Plot>.Update.Push(u => u.Harvests, harvest);

            var result = await _context.Plots.FindOneAndUpdateAsync(filter, update);
        }
        //public async Task<Harvest?> GetAsync(string plotId, string harvestId)
        //{
        //    var filter = Builders<Plot>.Filter.Eq(x => x.Id, plotId);
        //    filter &= Builders<Plot>.Filter.Eq(x => x.User.Id, plotId);

        //    return (await _context.Plots.FindAsync(filter)).FirstOrDefault();
        //}
        public async Task<List<Harvest>> GetPlotHarvestsAsync(string plotId)
        {
            var filter = Builders<Plot>.Filter.Eq(x => x.Id, plotId);

            return (await _context.Plots.Find(filter).FirstOrDefaultAsync()).Harvests;
        }

        //public async Task<Harvest> UpdateAsync(string plotId, HarvestDTO harvestDTO)
        //{
        //    var filter = Builders<Plot>.Filter.Eq(x => x.Id, plotId);
        //    filter &= Builders<Plot>.Filter.Eq(x => x.Harvests.Id, plotId);
        //    var userdbRef = new MongoDBRef("Users", plotId);

        //    var plot = new Plot
        //    {
        //        Id = harvestDTO.Id,
        //        Area = harvestDTO.Area,
        //        CurrentCulture = harvestDTO.CurrentCulture,
        //        Harvests = new List<Harvest>(),
        //        Municipality = harvestDTO.Municipality,
        //        PlotNumber = harvestDTO.PlotNumber,
        //        User = userdbRef,
        //        BorderPoints = new List<GeoJsonPoint<GeoJson2DGeographicCoordinates>>()
        //    };
        //    harvestDTO.BorderPoints.ForEach(point =>
        //    {
        //        var loc = GeoJson.Point(new GeoJson2DGeographicCoordinates(point.X, point.Y));
        //        plot.BorderPoints.Add(loc);
        //    });

        //    var plotResult = await _context.Plots.ReplaceOneAsync(filter, plot);
        //    //TODO: Sredi update summary-a, izgleda da ne funkcionise
        //    var plotSum = new PlotSummary
        //    {
        //        Id = new MongoDBRef("Plots", plot.Id),
        //        Area = plot.Area,
        //        Municipality = plot.Municipality,
        //        PlotNumber = plot.PlotNumber
        //    };

        //    var filterSummary = Builders<User>.Filter.Eq((u) => u.Id, plotId);
        //    var updateSummary = Builders<User>.Update.Push(u => u.Plots, plotSum);

        //    var result = await _context.Users.UpdateOneAsync(filterSummary, updateSummary);

        //    return plot;
        //}

        public async Task<bool> DeleteAsync(string harvestId, string plotId)
        {
            var filter = Builders<Plot>.Filter.Where(u => u.Id == plotId);
            var update = Builders<Plot>.Update.PullFilter(u => u.Harvests, Builders<Harvest>.Filter.Where(t => t.Id == ObjectId.Parse(harvestId)));

            var result = await _context.Plots.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
}
