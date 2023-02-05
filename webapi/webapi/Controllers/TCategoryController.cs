using BookStoreApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("category")]
    [ApiController]
    public class TCategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly ILogger<TCategoryController> _logger;
        public TCategoryController(
            ILogger<TCategoryController> logger, 
            CategoryService categoryService)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetTCategories()
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var result = (await _categoryService.GetCategoriesForUserAsync(userId))
                    .Select(c => new {
                        c.Id, 
                        User = c.User?.Id.AsString ?? null, 
                        c.Name 
                    });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> CreateCategory([FromBody] AddCategoryDTO newCategory)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var cat = await _categoryService.GetUserCategory(userId, newCategory.Name);

                if (cat != null)
                {
                    return BadRequest(new { msg = "Vec postoji kategorija sa zadatim imenom" });
                }

                TransactionCategory newC = new() 
                {
                    Name = newCategory.Name,
                    User = new MongoDBRef("User", userId),
                };

                await _categoryService.CreateAsync(newC);

                return Ok(new
                {
                    newC.Name,
                    User = newC.User.Id.AsString,
                    newC.Id
                });
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        }
    }
}
