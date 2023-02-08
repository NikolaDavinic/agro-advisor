﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webapi.DTO;
using webapi.Services;

namespace webapi.Controllers
{
    [Route("harvest")]
    [ApiController]
    public class HarvestController: ControllerBase
    {
        private readonly HarvestService _harvestService;
        public HarvestController(HarvestService harvestService)
        {
            _harvestService = harvestService;
        }
        [HttpPost("add/{plotId}")]
        public async Task<ActionResult> AddPlot(string plotId,[FromBody] HarvestDTO harvest)
        {
            try
            {
                await _harvestService.CreateAsync(harvest,plotId);
                return Ok("New harvest added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("harvests/{plotId}")]
        public async Task<ActionResult> GetPlotHarvests(string plotId)
        {
            try
            {
                if (String.IsNullOrEmpty(plotId))
                {
                    return BadRequest("Ne validan id parcele");
                }

                var result = await _harvestService.GetPlotHarvestsAsync(plotId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpDelete("{plotId}/{harvestId}")]
        public async Task<ActionResult> DeleteHarvest(string plotId,string harvestId)
        {
            try
            {
                await _harvestService.DeleteAsync(harvestId, plotId);

                return Ok("Berba je je obrisana");
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        }
    }
}
