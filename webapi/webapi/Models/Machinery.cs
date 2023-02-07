using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class Machinery
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRequired]
        [BsonRepresentation(BsonType.String)]
        public MachineType Type { get; set; }
        [BsonRequired]
        public string Model { get; set; } = null!;
        public int? ProductionYear { get; set; }
        public List<string> Images { get; set; } = new();
        public string? LicensePlate { get; set; }
        public DateTime? RegisteredUntil { get; set; }
        [JsonIgnore]
        [BsonRequired]
        public MongoDBRef User { get; set; } = null!;
    }

    public enum MachineType
    {
        Kombi,
        Kamion,
        Traktor, 
        Kombajn, //kombajn
        Motokultivator,
        Ostalo
    }
}