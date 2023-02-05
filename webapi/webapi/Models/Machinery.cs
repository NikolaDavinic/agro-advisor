using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;

namespace webapi.Models
{
    public class Machinery
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRequired]
        public int? Type { get; set; }
        [BsonRequired]
        public string? Model { get; set; }
        public int? ProductionYear { get; set; }
        public List<string> Images { get; set; } = new();
        public string? LicensePlate { get; set; }
        [BsonRequired]
        public MongoDBRef UserId { get; set; } = null!;
    }

    public enum MachineType
    {
        Van,
        Truck,
        Tractor, 
        Harvester, //kombajn
        MotorCultivator
    }
}