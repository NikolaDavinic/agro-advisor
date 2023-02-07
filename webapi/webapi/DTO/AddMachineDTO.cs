using webapi.Models;

namespace webapi.DTO
{
    public class AddMachineDTO
    {
        public MachineType Type { get; set; }
        public string Model { get; set; } = null!;
        public int? ProductionYear { get; set; }
        public List<string> Images { get; set; } = new();
        public string? LicensePlate { get; set; }
        public DateTime? RegisteredUntil { get; set; }
    }
}
