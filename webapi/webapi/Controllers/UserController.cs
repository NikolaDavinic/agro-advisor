using BookStoreApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;
using ZstdSharp.Unsafe;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UsersService _usersService;
        public UserController(ILogger<UserController> logger, UsersService usersService)
        {
            _usersService = usersService;
        }
        [HttpPost("signup")]
        public async Task<ActionResult> SignUp([FromBody] UserDTO user)
        {
            await _usersService.CreateAsync(user);
            return Ok(new { msg = "User registered" });
        }

        [HttpPost("signin")]
        public async Task<ActionResult> SignIn([FromBody] AuthCredsDTO creds)
        {
            var user = await _usersService.GetByEmailAsync(creds.Email);

            if (user == null || !_usersService.VerifyPassword(creds.Password, user.PasswordHash))
            {
                return Unauthorized(new { msg = "Wrong email or password" });
            }

            return Ok(new
            {
                User = user,
                Token = _usersService.CreateToken(user)
            });
        }

        //[HttpPost("plot")]
        //public async Task<ActionResult> CreatePlot([FromBody] Plot plot)
        //{
        //    await _context.Plots.InsertOneAsync(plot);

        //    //_context.Users.UpdateOne(x => x.Id == plot.UserId, (user) =>
        //    //{
        //    //    user.Plots.Add(new PlotSummary
        //    //    {
        //    //        Id = plot.Id,
        //    //        Area = plot.Area,
        //    //        PlotNumber = plot.PlotNumber,
        //    //        Municipality = plot.Municipality
        //    //    });

        //    //    return user;
        //    //});

        //    var filter = Builders<User>.Filter.Eq("Id", plot.UserId);
        //    var update = Builders<User>.Update.Push(e => e.Plots, new PlotSummary
        //    {
        //        Id = plot.Id,
        //        Area = plot.Area,
        //        PlotNumber = plot.PlotNumber,
        //        Municipality = plot.Municipality
        //    });

        //    _context.Users.FindOneAndUpdate(filter, update);

        //    return Ok("Valjda radi");
        //}
    }
}