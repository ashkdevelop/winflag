namespace Winflag.Application.DTOs;

public record ProductCategoryDto(int Id, string Name, string Slug, string? Description, string? ImageUrl, int SortOrder);

public record ProductVariantDto(int Id, string Size, string Material, decimal PricePerUnit, string? Dimensions);

public record ProductDto(
    int Id, string Name, string Slug, string? Description, string? ShortDescription,
    decimal BasePrice, int MinOrderQuantity, string? ImageUrl, List<string> ImageUrls,
    string? Material, bool IsActive, bool IsFeatured,
    ProductCategoryDto Category, List<ProductVariantDto> Variants);

public record CreateProductDto(
    string Name, string? Description, string? ShortDescription,
    decimal BasePrice, int MinOrderQuantity, string? Material,
    bool IsFeatured, int CategoryId);

public record UpdateProductDto(
    string Name, string? Description, string? ShortDescription,
    decimal BasePrice, int MinOrderQuantity, string? Material,
    bool IsFeatured, bool IsActive, int CategoryId);

public record CreateCategoryDto(string Name, string? Description);
public record UpdateCategoryDto(string Name, string? Description, bool IsActive, int SortOrder);
