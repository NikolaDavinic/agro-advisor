using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver.GeoJsonObjectModel;
using System.Text.Json.Serialization;
using webapi.Models;

namespace DTOs
{
    public class Point
    {
        public double X { get; set; }
        public double Y { get; set; }
    }

    public class HarvestDTO
    {
        public string? Id { get; set; }
        public string? CultureName { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }

    public class PlotDTO
    {
        public string? Id { get; set; }
        public int Area { get; set; }
        public int PlotNumber { get; set; }
        public string Municipality { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string CurrentCulture { get; set; } = null!;
        public List<Point> BorderPoints { get; set; } = new();
        public List<HarvestDTO> Harvests { get; set; } = new();
    }
}

