using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webapi.DTO;
using webapi.Models;
using webapi.Services;

namespace webapi.Controllers
{
    [Route("plot")]
    [ApiController]
    public class PlotController: ControllerBase
    {
        private readonly ILogger<PlotController> _logger;
        private readonly PlotService _plotService;
        public PlotController(
            ILogger<PlotController> logger,
            PlotService plotService)
        {
            _plotService = plotService;
            _logger = logger;
        }
        [HttpPost("add")]
        public async Task<ActionResult> AddPlot([FromBody] PlotDTO plot)
        {
            try
            {
                await _plotService.CreateAsync(plot);
                return Ok("New plot added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //TODO:Koristi ID trenutnog korisnika umesto hardkodirani
        //[Authorize]
        [HttpGet("{plotId}")]
        public async Task<ActionResult> GetPlot(string plotId)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;
                //userId= "63df951c945d31aa29069e31";
                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var result = await _plotService.GetAsync(userId, plotId);
                if (result == null)
                    return BadRequest("Ne postoji plot za trazeni ID");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("plots")]
        public async Task<ActionResult> GetUserPlots()
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;
                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var result = await _plotService.GetUserPlotsAsync(userId);
                //if (result == null)
                //    return BadRequest("Korisnik nema registrovanog zemljista!");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("plotsSum")]
        public async Task<ActionResult> GetUserPlotSummaries()
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;
                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var plots = await _plotService.GetUserPlotSummariesAsync(userId);

                return Ok(plots.Select((p) => new { Id = p.Id.Id.AsString, p.PlotNumber, p.Area, p.Municipality }));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("edit")]
        public async Task<ActionResult> EditPlot([FromBody] PlotDTO plot)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;
                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }
                var retVal=await _plotService.UpdateAsync(userId, plot);
                return Ok(retVal);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
