using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Winflag.Application.DTOs;
using Winflag.Infrastructure.Services;

namespace Winflag.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _products;
    public ProductsController(IProductService products) => _products = products;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] bool activeOnly = true)
        => Ok(await _products.GetAllAsync(categoryId, activeOnly));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _products.GetByIdAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var p = await _products.GetBySlugAsync(slug);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() => Ok(await _products.GetCategoriesAsync());

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var p = await _products.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateProductDto dto)
    {
        var p = await _products.UpdateAsync(id, dto);
        return p == null ? NotFound() : Ok(p);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => (await _products.DeleteAsync(id)) ? NoContent() : NotFound();

    [Authorize(Roles = "Admin")]
    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        => Ok(await _products.CreateCategoryAsync(dto));

    [Authorize(Roles = "Admin")]
    [HttpPut("categories/{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
    {
        var c = await _products.UpdateCategoryAsync(id, dto);
        return c == null ? NotFound() : Ok(c);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id:int}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file, [FromServices] IMediaService media)
    {
        var asset = await media.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType, "products", null);
        var p = await _products.GetByIdAsync(id);
        if (p == null) return NotFound();
        // Update product imageUrl
        var updateDto = new UpdateProductDto(p.Name, p.Description, p.ShortDescription, p.BasePrice, p.MinOrderQuantity, p.Material, p.IsFeatured, p.IsActive, p.Category.Id);
        await _products.UpdateAsync(id, updateDto);
        return Ok(asset);
    }
}
