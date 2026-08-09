namespace Winflag.Application.DTOs;

public record PageContentDto(int Id, string PageKey, string Section, string? Title, string? Subtitle, string? Body, string? ImageUrl, string? CtaText, string? CtaLink, string? MetaJson);
public record UpdatePageContentDto(string? Title, string? Subtitle, string? Body, string? ImageUrl, string? CtaText, string? CtaLink, string? MetaJson);

public record MediaAssetDto(int Id, string FileName, string Url, string? AltText, string? Folder, long SizeBytes, DateTime UploadedAt);

public record TestimonialDto(int Id, string CustomerName, string City, string Occasion, string Review, int Rating, string? AvatarUrl, int SortOrder);
public record UpsertTestimonialDto(string CustomerName, string City, string Occasion, string Review, int Rating, string? AvatarUrl, int SortOrder);

public record GalleryItemDto(int Id, string ImageUrl, string? Caption, string Occasion, string? City, string? FlagType, int? QuantityOrdered, int SortOrder);
public record UpsertGalleryItemDto(string? Caption, string Occasion, string? City, string? FlagType, int? QuantityOrdered, int SortOrder);

public record FaqDto(int Id, string Question, string Answer, string Category, int SortOrder);
public record UpsertFaqDto(string Question, string Answer, string Category, int SortOrder);

public record QuoteRequestDto(
    string Name, string Email, string Phone, string FlagType, string Size,
    string Material, int Quantity, string Occasion, bool NeedsDesign,
    string DeliveryPincode, string DeliveryType, string? Notes);

public record QuoteDto(int Id, string Name, string Email, string Phone, string FlagType, string Size,
    string Material, int Quantity, string Occasion, bool NeedsDesign,
    string DeliveryPincode, string DeliveryType, string? Notes, decimal? QuotedPrice, string Status, DateTime CreatedAt);

public record BlogPostDto(int Id, string Title, string Slug, string? Excerpt, string Content, string? CoverImageUrl, string? Tags, bool IsPublished, DateTime? PublishedAt);
public record UpsertBlogPostDto(string Title, string? Excerpt, string Content, string? CoverImageUrl, string? Tags, bool IsPublished);
