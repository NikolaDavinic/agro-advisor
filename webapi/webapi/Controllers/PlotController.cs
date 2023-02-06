using BookStoreApi.Services;
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
    }
}
