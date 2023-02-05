using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;

namespace webapi.DTO
{
    public class AddTransactionDTO
    {
        public decimal Value { get; set; }
        public string CategoryId { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public string Description { get; set; } = null!;
        //public DateTime Date { get; set; }
    }
}
