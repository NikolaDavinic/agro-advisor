using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace webapi.Models
{
    public class Culture
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? Name { get; set; }
    }
}
