using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace webapi.DTO
{
    public class UserDTO
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Address { get; set; } = null!;

    }
}
