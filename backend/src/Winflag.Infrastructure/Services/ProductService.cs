using Microsoft.EntityFrameworkCore;
using Winflag.Application.DTOs;
using Winflag.Core.Entities;
using Winflag.Infrastructure.Data;

namespace Winflag.Infrastructure.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(int? categoryId = null, bool activeOnly = true);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto?> GetBySlugAsync(string slug);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<ProductCategoryDto>> GetCategoriesAsync();
    Task<ProductCategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task<ProductCategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto dto);
}

public class ProductService : IProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<ProductDto>> GetAllAsync(int? categoryId = null, bool activeOnly = true)
    {
        var q = _db.Products.Include(p => p.Category).Include(p => p.Variants).AsQueryable();
        if (activeOnly) q = q.Where(p => p.IsActive);
        if (categoryId.HasValue) q = q.Where(p => p.CategoryId == categoryId);
        return (await q.ToListAsync()).Select(MapProduct);
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var p = await _db.Products.Include(p => p.Category).Include(p => p.Variants).FirstOrDefaultAsync(p => p.Id == id);
        return p == null ? null : MapProduct(p);
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug)
    {
        var p = await _db.Products.Include(p => p.Category).Include(p => p.Variants).FirstOrDefaultAsync(p => p.Slug == slug);
        return p == null ? null : MapProduct(p);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Slug = Slugify(dto.Name),
            Description = dto.Description,
            ShortDescription = dto.ShortDescription,
            BasePrice = dto.BasePrice,
            MinOrderQuantity = dto.MinOrderQuantity,
            Material = dto.Material,
            IsFeatured = dto.IsFeatured,
            CategoryId = dto.CategoryId
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(product.Id))!;
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return null;
        product.Name = dto.Name;
        product.Slug = Slugify(dto.Name);
        product.Description = dto.Description;
        product.ShortDescription = dto.ShortDescription;
        product.BasePrice = dto.BasePrice;
        product.MinOrderQuantity = dto.MinOrderQuantity;
        product.Material = dto.Material;
        product.IsFeatured = dto.IsFeatured;
        product.IsActive = dto.IsActive;
        product.CategoryId = dto.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return false;
        product.IsActive = false;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<ProductCategoryDto>> GetCategoriesAsync()
    {
        return (await _db.ProductCategories.Where(c => c.IsActive).OrderBy(c => c.SortOrder).ToListAsync())
            .Select(c => new ProductCategoryDto(c.Id, c.Name, c.Slug, c.Description, c.ImageUrl, c.SortOrder));
    }

    public async Task<ProductCategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var cat = new ProductCategory { Name = dto.Name, Slug = Slugify(dto.Name), Description = dto.Description };
        _db.ProductCategories.Add(cat);
        await _db.SaveChangesAsync();
        return new ProductCategoryDto(cat.Id, cat.Name, cat.Slug, cat.Description, cat.ImageUrl, cat.SortOrder);
    }

    public async Task<ProductCategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto dto)
    {
        var cat = await _db.ProductCategories.FindAsync(id);
        if (cat == null) return null;
        cat.Name = dto.Name; cat.Slug = Slugify(dto.Name);
        cat.Description = dto.Description; cat.IsActive = dto.IsActive; cat.SortOrder = dto.SortOrder;
        await _db.SaveChangesAsync();
        return new ProductCategoryDto(cat.Id, cat.Name, cat.Slug, cat.Description, cat.ImageUrl, cat.SortOrder);
    }

    private static ProductDto MapProduct(Product p) => new(
        p.Id, p.Name, p.Slug, p.Description, p.ShortDescription, p.BasePrice, p.MinOrderQuantity,
        p.ImageUrl, p.ImageUrls, p.Material, p.IsActive, p.IsFeatured,
        new ProductCategoryDto(p.Category.Id, p.Category.Name, p.Category.Slug, p.Category.Description, p.Category.ImageUrl, p.Category.SortOrder),
        p.Variants.Select(v => new ProductVariantDto(v.Id, v.Size, v.Material, v.PricePerUnit, v.Dimensions)).ToList()
    );

    private static string Slugify(string name) =>
        System.Text.RegularExpressions.Regex.Replace(name.ToLower().Trim(), @"[^a-z0-9]+", "-").Trim('-');
}
