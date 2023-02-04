using MongoDB.Driver;

namespace webapi.Models
{
    public interface IDbContext
    {
        IMongoCollection<Plot> Plots { get; set; }
        IMongoCollection<User> Users { get; set; }

        IMongoCollection<T> GetCollection<T>(string name);
    }
}