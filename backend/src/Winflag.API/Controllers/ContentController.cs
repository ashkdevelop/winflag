using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Winflag.Application.DTOs;
using Winflag.Infrastructure.Services;

namespace Winflag.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    private readonly IContentService _content;
    public ContentController(IContentService content) => _content = content;

    [HttpGet("page/{pageKey}")]
    public async Task<IActionResult> GetPage(string pageKey)
        => Ok(await _content.GetPageAsync(pageKey));

    [HttpGet("page/{pageKey}/{section}")]
    public async Task<IActionResult> GetSection(string pageKey, string section)
    {
        var c = await _content.GetSectionAsync(pageKey, section);
        return c == null ? NotFound() : Ok(c);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("page/{pageKey}/{section}")]
    public async Task<IActionResult> UpsertSection(string pageKey, string section, UpdatePageContentDto dto)
        => Ok(await _content.UpsertSectionAsync(pageKey, section, dto));

    // Testimonials
    [HttpGet("testimonials")]
    public async Task<IActionResult> GetTestimonials() => Ok(await _content.GetTestimonialsAsync());

    [Authorize(Roles = "Admin")]
    [HttpPost("testimonials")]
    public async Task<IActionResult> CreateTestimonial(UpsertTestimonialDto dto)
        => Ok(await _content.CreateTestimonialAsync(dto));

    [Authorize(Roles = "Admin")]
    [HttpPut("testimonials/{id:int}")]
    public async Task<IActionResult> UpdateTestimonial(int id, UpsertTestimonialDto dto)
    {
        var t = await _content.UpdateTestimonialAsync(id, dto);
        return t == null ? NotFound() : Ok(t);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("testimonials/{id:int}")]
    public async Task<IActionResult> DeleteTestimonial(int id)
        => (await _content.DeleteTestimonialAsync(id)) ? NoContent() : NotFound();

    // Gallery
    [HttpGet("gallery")]
    public async Task<IActionResult> GetGallery([FromQuery] string? occasion)
        => Ok(await _content.GetGalleryAsync(occasion));

    [Authorize(Roles = "Admin")]
    [HttpPost("gallery")]
    public async Task<IActionResult> CreateGalleryItem(IFormFile image, [FromForm] UpsertGalleryItemDto dto, [FromServices] IMediaService media)
    {
        var asset = await media.UploadAsync(image.OpenReadStream(), image.FileName, image.ContentType, "gallery", null);
        return Ok(await _content.CreateGalleryItemAsync(asset.Url, dto));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("gallery/{id:int}")]
    public async Task<IActionResult> UpdateGalleryItem(int id, UpsertGalleryItemDto dto)
    {
        var g = await _content.UpdateGalleryItemAsync(id, dto);
        return g == null ? NotFound() : Ok(g);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("gallery/{id:int}")]
    public async Task<IActionResult> DeleteGalleryItem(int id)
        => (await _content.DeleteGalleryItemAsync(id)) ? NoContent() : NotFound();

    // FAQ
    [HttpGet("faq")]
    public async Task<IActionResult> GetFaqs([FromQuery] string? category)
        => Ok(await _content.GetFaqsAsync(category));

    [Authorize(Roles = "Admin")]
    [HttpPost("faq")]
    public async Task<IActionResult> CreateFaq(UpsertFaqDto dto)
        => Ok(await _content.CreateFaqAsync(dto));

    [Authorize(Roles = "Admin")]
    [HttpPut("faq/{id:int}")]
    public async Task<IActionResult> UpdateFaq(int id, UpsertFaqDto dto)
    {
        var f = await _content.UpdateFaqAsync(id, dto);
        return f == null ? NotFound() : Ok(f);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("faq/{id:int}")]
    public async Task<IActionResult> DeleteFaq(int id)
        => (await _content.DeleteFaqAsync(id)) ? NoContent() : NotFound();

    // Quotes
    [HttpPost("quotes")]
    public async Task<IActionResult> CreateQuote(QuoteRequestDto dto)
        => Ok(await _content.CreateQuoteAsync(dto));

    [Authorize(Roles = "Admin")]
    [HttpGet("quotes")]
    public async Task<IActionResult> GetQuotes() => Ok(await _content.GetQuotesAsync());

    [Authorize(Roles = "Admin")]
    [HttpPut("quotes/{id:int}/price")]
    public async Task<IActionResult> UpdateQuotePrice(int id, [FromBody] decimal price)
    {
        var q = await _content.UpdateQuotePriceAsync(id, price);
        return q == null ? NotFound() : Ok(q);
    }

    // Blog
    [HttpGet("blog")]
    public async Task<IActionResult> GetBlogPosts() => Ok(await _content.GetBlogPostsAsync());

    [HttpGet("blog/{slug}")]
    public async Task<IActionResult> GetBlogPost(string slug)
    {
        var b = await _content.GetBlogPostAsync(slug);
        return b == null ? NotFound() : Ok(b);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("blog")]
    public async Task<IActionResult> CreateBlogPost(UpsertBlogPostDto dto)
        => Ok(await _content.CreateBlogPostAsync(dto));

    [Authorize(Roles = "Admin")]
    [HttpPut("blog/{id:int}")]
    public async Task<IActionResult> UpdateBlogPost(int id, UpsertBlogPostDto dto)
    {
        var b = await _content.UpdateBlogPostAsync(id, dto);
        return b == null ? NotFound() : Ok(b);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("blog/{id:int}")]
    public async Task<IActionResult> DeleteBlogPost(int id)
        => (await _content.DeleteBlogPostAsync(id)) ? NoContent() : NotFound();
}
