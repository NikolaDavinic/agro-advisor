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
                    UserId = new MongoDBRef("User", userId)
                };

                await _machineryService.CreateAsync(userId, machine);

                return Ok();
            }
            catch (Exception e)
            {
                return Ok(new { msg = e.Message });
            } 
        }
    }
}
