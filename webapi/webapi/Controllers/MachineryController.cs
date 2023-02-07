using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using webapi.Services;

namespace webapi.Controllers
{
    [Route("machinery")]
    [ApiController]
    public class MachineryController : ControllerBase
    {
        private readonly ILogger<MachineryController> _logger;
        private readonly MachineryService _machineryService;
        public MachineryController(
            ILogger<MachineryController> logger,
            MachineryService machineryService)
        {
            _machineryService = machineryService;
            _logger = logger;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetMachines()
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var machines = await _machineryService.GetUserMachineSummaries(userId);

                return Ok(machines.Select((m) => new { Id = m.Id.Id.AsString, m.Model, m.RegisteredUntil, Type = m.Type.ToString() }));
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetMachineById(string id)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                var machine = await _machineryService.GetMachineForUser(userId, id);

                return Ok(machine);
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> CreateMachine([FromBody] AddMachineDTO newMachine)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var machine = new Machinery
                {
                    LicensePlate = newMachine.LicensePlate,
                    ProductionYear = newMachine.ProductionYear,
                    RegisteredUntil = newMachine.RegisteredUntil,
                    Model = newMachine.Model,
                    Type = newMachine.Type,
                    Images = newMachine.Images,
                    User = new MongoDBRef("Users", userId)
                };

                await _machineryService.CreateAsync(userId, machine);

                return Ok(new
                {
                    machine.Id,
                    Type = machine.Type.ToString(),
                    machine.LicensePlate,
                    machine.ProductionYear,
                    machine.RegisteredUntil,
                    machine.Model,
                    machine.Images,
                });
            }
            catch (Exception e)
            {
                return Ok(new { msg = e.Message });
            } 
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMachine(string id)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                await _machineryService.DeleteAsync(userId, id);

                return Ok(new { msg = "Masina je obrisana"} );
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        }
    }
}
