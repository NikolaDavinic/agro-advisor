using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using webapi.DTO;

namespace webapi.Models
{
    public class PlotSummary
    {
        public MongoDBRef Id { get; set; } = null!;
        public int Area { get; set; }
        public int PlotNumber { get; set; }
        public string Municipality { get; set; } = null!;
        public string CurrentCulture { get; set; } = null!;
    }

    public class MachinerySummary
    {
        [JsonIgnore]
        public MongoDBRef Id { get; set; } = null!;
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public MachineType? Type { get; set; }
        public string? Model { get; set; }
        public DateTime? RegisteredUntil { get; set; }
    }

    public class Transaction
    {
        [BsonId]
        public ObjectId? Id { get; set; }
        public decimal Value { get; set; }
        [JsonIgnore]
        public MongoDBRef Category { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Date { get; set; }

        public Transaction()
        {
            this.Id = ObjectId.GenerateNewId();
        }
    }

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRequired]
        public string Name { get; set; } = null!;
        [BsonRequired]
        public string Email { get; set; } = null!;
        [JsonIgnore]
        [BsonRequired]
        public string PasswordHash { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string Address { get; set; } = null!;
        public Point AdressPoint { get; set; } = null!;
        [JsonIgnore]
        public List<PlotSummary> Plots { get; set; } = new();
        [JsonIgnore]
        public List<Transaction> Transactions { get; set; } = new();
        [JsonIgnore]
        public List<MachinerySummary> Machines { get; set; } = new();
    }
}
