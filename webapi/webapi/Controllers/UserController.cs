using BookStoreApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MongoDB.Driver;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UsersService _usersService;
        private readonly DbContext _context;
        public UserController(ILogger<UserController> logger, UsersService usersService, DbContext context)
        {
            _usersService = usersService;
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] User user)
        {
            await _usersService.CreateAsync(user);
            return Ok("Valjda radi");
        }

        [HttpPost("plot")]
        public async Task<ActionResult> CreatePlot([FromBody] Plot plot)
        {
            await _context.Plots.InsertOneAsync(plot);

            //_context.Users.UpdateOne(x => x.Id == plot.UserId, (user) =>
            //{
            //    user.Plots.Add(new PlotSummary
            //    {
            //        Id = plot.Id,
            //        Area = plot.Area,
            //        PlotNumber = plot.PlotNumber,
            //        Municipality = plot.Municipality
            //    });

            //    return user;
            //});



            var filter = Builders<User>.Filter.Eq("Id", plot.UserId);
            var update = Builders<User>.Update.Push(e => e.Plots, new PlotSummary
            {
                Id = plot.Id,
                Area = plot.Area,
                PlotNumber = plot.PlotNumber,
                Municipality = plot.Municipality
            });

            return Ok("Valjda radi");
        }
    }
}