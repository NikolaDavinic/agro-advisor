using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MongoDB.Driver.GeoJsonObjectModel;
using System.Data.Common;
using System.Threading;
using System.Transactions;
using webapi.DTO;
using webapi.Models;
using MongoDB.Libmongocrypt;

namespace webapi.Services
{
    public class PlotService
    {
        private readonly IDbContext _context;
        public PlotService(IDbContext context)
        {
            _context = context;
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
        public async Task<List<PlotSummary>> GetUserPlotSummariesAsync(string userId)
        {
            //var filter = Builders<User>.Filter.Eq(x => x.Id, userId);
            var result = await _context.Users.AsQueryable()
                .Where(u => u.Id == userId)
                .Select(u => u.Plots)
                .SingleAsync();

            return result;

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
            //TODO: Sredi update summary-a, izgleda da ne funkcionise
            var plotSum = new PlotSummary
            {
                Id = new MongoDBRef("Plots", plot.Id),
                Area = plot.Area,
                Municipality = plot.Municipality,
                PlotNumber = plot.PlotNumber
            };


            //TODO: Radi ali ne radi
            //var filterSummary = Builders<User>.Filter.Eq((u) => u.Id, userId);
            //filterSummary &= Builders<User>.Filter.ElemMatch(u => u.Plots, Builders<PlotSummary>.Filter.Eq(x => x.Id.Id, plot.Id));

            //var update = Builders<User>.Update
            //    .Set(x => x.Plots.First().PlotNumber, plot.PlotNumber)
            //    .Set(x => x.Plots.First().Area, plot.Area)
            //    .Set(x => x.Plots.First().Municipality, plot.Municipality);

            //await _context.Users.FindOneAndUpdateAsync(filterSummary, update);

            //2. POKUSAJ ISTO DAJE MENJA PRVI UVEK
            //var filterUser = Builders<User>.Filter;
            //var userIdAndPlotIdFilter = filterUser.And(
            //    filterUser.Eq(x => x.Id, userId),
            //    filterUser.ElemMatch(x => x.Plots, c => c.Id.Id == plot.Id));
            //// find user with id and plot id
            //var user = _context.Users.Find(userIdAndPlotIdFilter).SingleOrDefault();

            //// update with positional operator
            //var update = Builders<User>.Update;
            //var plotSetter = update
            //    .Set(x => x.Plots.First().PlotNumber, plot.PlotNumber)
            //    .Set(x => x.Plots.First().Area, plot.Area)
            //    .Set(x => x.Plots.First().Municipality, plot.Municipality);

            //_context.Users.UpdateOne(userIdAndPlotIdFilter, plotSetter);

            var filterBuilder = Builders<User>.Filter;
            var filterUser = filterBuilder.Eq(x => x.Id, userId) &
                filterBuilder.ElemMatch(doc => doc.Plots, el => el.Id.Id == plotDTO.Id);

            var updateBuilder = Builders<User>.Update;
            var update = updateBuilder.Set(doc => doc.Plots.FirstMatchingElement().PlotNumber, plot.PlotNumber)
                                        .Set(doc => doc.Plots.FirstMatchingElement().Area, plot.Area)
                                        .Set(doc => doc.Plots.FirstMatchingElement().Municipality, plot.Municipality);

            _context.Users.UpdateOne(filterUser, update);

            return plot;
        }

        public async Task<bool> DeleteAsync(string userId, string plotId)
        {
            var userFilter = Builders<User>.Filter.Where(u => u.Id == userId);
            var userUpdate = Builders<User>.Update.PullFilter(u => u.Plots, Builders<PlotSummary>.Filter.Where(m => m.Id.Id == plotId));

            var resultSummary = await _context.Users.UpdateOneAsync(userFilter, userUpdate);

            var plotFilter = Builders<Plot>.Filter.Eq((m) => m.Id, plotId) &
                Builders<Plot>.Filter.Eq((m) => m.User.Id, userId);

            var resultPlot = await _context.Plots.FindOneAndDeleteAsync(plotFilter);

            return resultSummary != null;
        }
    }
}
