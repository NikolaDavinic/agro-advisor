using MongoDB.Driver;

namespace webapi.Models
{
    public class DbContext : IDbContext
    {
        public readonly IMongoDatabase _db;
        public readonly IMongoClient _mongoClient;

        public IMongoDatabase DB { get { return _db; } }
        public IMongoClient MongoClient { get { return _mongoClient; } }
        public IMongoCollection<User> Users { get; set; }
        public IMongoCollection<Plot> Plots { get; set; }
        public IMongoCollection<TransactionCategory> TCategories { get; set; }
        public IMongoCollection<Machinery> Machines { get; set; }
        public DbContext(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _db = _mongoClient.GetDatabase("AgroAdvisor");

            Users = GetCollection<User>("Users");
            Plots = GetCollection<Plot>("Plots");
            Machines = GetCollection<Machinery>("Machines");
            TCategories = GetCollection<TransactionCategory>("TCategories");
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _db.GetCollection<T>(name);
        }
    }
}
