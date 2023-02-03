using MongoDB.Driver;

namespace webapi.Models
{
    public class DbContext 
    {
        private readonly IMongoDatabase _db;
        private readonly IMongoClient _mongoClient;
        public IMongoCollection<User> Users { get; set; }
        public IMongoCollection<Plot> Plots { get; set; }
        public DbContext(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _db = _mongoClient.GetDatabase("AgroAdvisor");

            Users = GetCollection<User>("Users");
            Plots = GetCollection<Plot>("Plots");
            //Users = GetCollection<User>("Users");
            //Users = GetCollection<User>("Users");
        }
        private IMongoCollection<T> GetCollection<T>(string name)
        {
            return _db.GetCollection<T>(name);
        }
    }
}
