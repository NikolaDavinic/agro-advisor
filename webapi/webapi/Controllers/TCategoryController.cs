using BookStoreApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

                return Ok(await _categoryService.GetCategoriesForUserAsync(userId));
            }
            catch (Exception ex)
            {
                return BadRequest(new { msg = ex.Message });
            }
        }

        //[Authorize]
        //[HttpPost]
        //public async Task<ActionResult> CreateCategory()
        //{
        //    try
        //    {

        //    }
        //    catch (Exception e)
        //    {

        //    }
        //}
    }
}
