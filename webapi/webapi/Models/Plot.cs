using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class Harvest
    {
        [BsonId]
        public ObjectId? Id { get; set; }
        public string? CultureName { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Harvest()
        {
            this.Id = ObjectId.GenerateNewId();
        }
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
        //[JsonIgnore]
        [BsonRequired]
        public List<GeoJsonPoint<GeoJson2DGeographicCoordinates>> BorderPoints { get; set; } = new();
        public string Municipality { get; set; } = null!;
        [JsonIgnore]
        [BsonRequired]
        public MongoDBRef User{ get; set; } = null!;
        public string CurrentCulture { get; set; } = null!;
        public List<Harvest> Harvests { get; set; } = new();
    }
}
