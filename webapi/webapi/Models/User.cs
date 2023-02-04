using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class PlotSummary
    {
        public string Id { get; set; } = null!;
        public int Area { get; set; }
        public int PlotNumber { get; set; }
        public string Municipality { get; set; } = null!;
    }

    public class MachinerySummary
    {
        public string Id { get; set; } = null!;
        public int? Type { get; set; }
        public string? Model { get; set; }
    }

    public class Transaction
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public decimal Value { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
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
        //[JsonIgnore]
        //[BsonRequired]
        //public string PasswordHash { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string Adress { get; set; } = null!;
        public List<PlotSummary> Plots { get; set; } = new();
        public List<Transaction> Transactions { get; set; } = new();
    }
}
