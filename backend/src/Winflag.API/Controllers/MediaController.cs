using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Winflag.Infrastructure.Services;

namespace Winflag.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _media;
    public MediaController(IMediaService media) => _media = media;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? folder)
        => Ok(await _media.GetAllAsync(folder));

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string? folder, [FromQuery] string? altText)
    {
        if (file.Length == 0) return BadRequest("Empty file.");
        var asset = await _media.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType, folder, altText);
        return Ok(asset);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => (await _media.DeleteAsync(id)) ? NoContent() : NotFound();
}
