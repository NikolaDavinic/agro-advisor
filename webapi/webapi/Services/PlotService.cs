using BookStoreApi.Services;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using System.Data.Common;
using System.Threading;
using System.Transactions;
using webapi.DTO;
using webapi.Models;

namespace webapi.Services
{
    public class PlotService
    {
        private readonly IDbContext _context;
        private readonly IConfiguration _config;
        public PlotService(
            IDbContext context,
            IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task CreateAsync(PlotDTO newPlot)
        {
            var userdbRef = new MongoDBRef("Users", newPlot.UserId);
            var plot = new Plot
            {
                Area = newPlot.Area,
                CurrentCulture = newPlot.CurrentCulture,
                Harvests = new List<Harvest>(),
                Municipality = newPlot.Municipality,
                PlotNumber = newPlot.PlotNumber,
                User = userdbRef,
                BorderPoints = new List<GeoJsonPoint<GeoJson2DGeographicCoordinates>>()
            };

            newPlot.BorderPoints.ForEach(point =>
            {
                var loc = GeoJson.Point(new GeoJson2DGeographicCoordinates(point.X, point.Y));
                plot.BorderPoints.Add(loc);
            });

            await _context.Plots.InsertOneAsync(plot);

            var plotSum = new PlotSummary
            {
                Id = new MongoDBRef("Plots", plot.Id),
                Area = plot.Area,
                Municipality = plot.Municipality,
                PlotNumber = plot.PlotNumber
            };

            var filter = Builders<User>.Filter.Eq((u) => u.Id, newPlot.UserId);
            var update = Builders<User>.Update.Push(u => u.Plots, plotSum);

            var result = await _context.Users.FindOneAndUpdateAsync(filter, update);

        }
        public async Task<Plot?> GetAsync(string userId,string plotId)
        {
            var filter = Builders<Plot>.Filter.Eq(x => x.Id, plotId);
            filter &= Builders<Plot>.Filter.Eq(x => x.User.Id, userId);

            return (await _context.Plots.FindAsync(filter)).FirstOrDefault();
        }
        public async Task<List<Plot>> GetUserPlotsAsync(string userId)
        {
            var filter = Builders<Plot>.Filter.Eq(x => x.User.Id, userId);

            return (await _context.Plots.Find(filter).ToListAsync());
        }
        //TODO:Combine Create and Update to CreateUpdate
        public async Task<Plot> UpdateAsync(string userId, PlotDTO plotDTO)
        {
            var filter = Builders<Plot>.Filter.Eq(x => x.Id, plotDTO.Id);
            filter &= Builders<Plot>.Filter.Eq(x => x.User.Id, userId);
            var userdbRef = new MongoDBRef("Users", userId);

            var plot = new Plot
            {
                Id = plotDTO.Id,
                Area = plotDTO.Area,
                CurrentCulture = plotDTO.CurrentCulture,
                Harvests = new List<Harvest>(),
                Municipality = plotDTO.Municipality,
                PlotNumber = plotDTO.PlotNumber,
                User = userdbRef,
                BorderPoints = new List<GeoJsonPoint<GeoJson2DGeographicCoordinates>>()
            };
            plotDTO.BorderPoints.ForEach(point =>
            {
                var loc = GeoJson.Point(new GeoJson2DGeographicCoordinates(point.X, point.Y));
                plot.BorderPoints.Add(loc);
            });

            var plotResult = await _context.Plots.ReplaceOneAsync(filter, plot);

            var plotSum = new PlotSummary
            {
                Id = new MongoDBRef("Plots", plot.Id),
                Area = plot.Area,
                Municipality = plot.Municipality,
                PlotNumber = plot.PlotNumber
            };

            var filterSummary = Builders<User>.Filter.Eq((u) => u.Id, userId);
            var updateSummary = Builders<User>.Update.Push(u => u.Plots, plotSum);

            var result = await _context.Users.UpdateOneAsync(filterSummary, updateSummary);

            return plot;
        }
    }
}
