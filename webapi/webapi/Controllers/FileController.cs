using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using webapi.Services;

namespace e_citaonica_api.Controllers
{
    [Route("files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly FileService _fileService;
        public FileController(
            FileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            string path = await _fileService.SaveFile(file);

            return Ok(new { path });
        }
    }
}