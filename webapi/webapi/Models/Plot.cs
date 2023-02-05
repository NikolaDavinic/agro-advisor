using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class Harvest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? CultureName { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }   

    public class Plot
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRequired]
        public int Area { get; set; } = 0;
        [BsonRequired]
        public int PlotNumber { get; set; }
        [JsonIgnore]
        [BsonRequired]
        public GeoJsonPoint<GeoJson2DCoordinates> BorderPoints { get; set; } = null!;
        public string Municipality { get; set; } = null!;
        [BsonRequired]
        public string UserId { get; set; } = null!;
        public string CurrentCulture { get; set; } = null!;
        public List<Harvest> Harvests { get; set; } = new();
    }
}
