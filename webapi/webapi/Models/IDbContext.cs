using MongoDB.Driver;

namespace webapi.Models
{
    public interface IDbContext
    {
        IMongoDatabase DB { get; }
        IMongoClient MongoClient { get; }
        IMongoCollection<Plot> Plots { get; set; }
        IMongoCollection<User> Users { get; set; }
        IMongoCollection<TransactionCategory> TCategories { get; set; }
        IMongoCollection<Machinery> Machines { get; set; }
        IMongoCollection<T> GetCollection<T>(string name);
    }
}