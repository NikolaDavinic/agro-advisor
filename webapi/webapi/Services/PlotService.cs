using BookStoreApi.Services;
using MongoDB.Driver.GeoJsonObjectModel;
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
            var plot = new Plot
            {
                Area = newPlot.Area,
                CurrentCulture = newPlot.CurrentCulture,
                Harvests = new List<Harvest>(),
                Municipality = newPlot.Municipality,
                PlotNumber = newPlot.PlotNumber,
                UserId = newPlot.UserId,
                BorderPoints = new List<GeoJsonPoint<GeoJson2DGeographicCoordinates>>()
            };

            newPlot.BorderPoints.ForEach(point =>
            {
                var loc = GeoJson.Point(new GeoJson2DGeographicCoordinates(point.X, point.Y));
                plot.BorderPoints.Add(loc);
            });
            await _context.Plots.InsertOneAsync(plot);
        }
    }
}
