using Microsoft.EntityFrameworkCore;
using Winflag.Application.DTOs;
using Winflag.Core.Entities;
using Winflag.Infrastructure.Data;

namespace Winflag.Infrastructure.Services;

public interface IContentService
{
    Task<IEnumerable<PageContentDto>> GetPageAsync(string pageKey);
    Task<PageContentDto?> GetSectionAsync(string pageKey, string section);
    Task<PageContentDto> UpsertSectionAsync(string pageKey, string section, UpdatePageContentDto dto);

    Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync();
    Task<TestimonialDto> CreateTestimonialAsync(UpsertTestimonialDto dto);
    Task<TestimonialDto?> UpdateTestimonialAsync(int id, UpsertTestimonialDto dto);
    Task<bool> DeleteTestimonialAsync(int id);

    Task<IEnumerable<GalleryItemDto>> GetGalleryAsync(string? occasion = null);
    Task<GalleryItemDto> CreateGalleryItemAsync(string imageUrl, UpsertGalleryItemDto dto);
    Task<GalleryItemDto?> UpdateGalleryItemAsync(int id, UpsertGalleryItemDto dto);
    Task<bool> DeleteGalleryItemAsync(int id);

    Task<IEnumerable<FaqDto>> GetFaqsAsync(string? category = null);
    Task<FaqDto> CreateFaqAsync(UpsertFaqDto dto);
    Task<FaqDto?> UpdateFaqAsync(int id, UpsertFaqDto dto);
    Task<bool> DeleteFaqAsync(int id);

    Task<IEnumerable<QuoteDto>> GetQuotesAsync();
    Task<QuoteDto> CreateQuoteAsync(QuoteRequestDto dto);
    Task<QuoteDto?> UpdateQuotePriceAsync(int id, decimal price);

    Task<IEnumerable<BlogPostDto>> GetBlogPostsAsync(bool publishedOnly = true);
    Task<BlogPostDto?> GetBlogPostAsync(string slug);
    Task<BlogPostDto> CreateBlogPostAsync(UpsertBlogPostDto dto);
    Task<BlogPostDto?> UpdateBlogPostAsync(int id, UpsertBlogPostDto dto);
    Task<bool> DeleteBlogPostAsync(int id);
}

public class ContentService : IContentService
{
    private readonly AppDbContext _db;
    public ContentService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<PageContentDto>> GetPageAsync(string pageKey)
    {
        return (await _db.PageContents.Where(p => p.PageKey == pageKey && p.IsActive).ToListAsync()).Select(MapContent);
    }

    public async Task<PageContentDto?> GetSectionAsync(string pageKey, string section)
    {
        var c = await _db.PageContents.FirstOrDefaultAsync(p => p.PageKey == pageKey && p.Section == section);
        return c == null ? null : MapContent(c);
    }

    public async Task<PageContentDto> UpsertSectionAsync(string pageKey, string section, UpdatePageContentDto dto)
    {
        var c = await _db.PageContents.FirstOrDefaultAsync(p => p.PageKey == pageKey && p.Section == section);
        if (c == null)
        {
            c = new PageContent { PageKey = pageKey, Section = section };
            _db.PageContents.Add(c);
        }
        c.Title = dto.Title; c.Subtitle = dto.Subtitle; c.Body = dto.Body;
        c.ImageUrl = dto.ImageUrl; c.CtaText = dto.CtaText; c.CtaLink = dto.CtaLink;
        c.MetaJson = dto.MetaJson; c.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapContent(c);
    }

    public async Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync() =>
        (await _db.Testimonials.Where(t => t.IsActive).OrderBy(t => t.SortOrder).ToListAsync())
        .Select(t => new TestimonialDto(t.Id, t.CustomerName, t.City, t.Occasion, t.Review, t.Rating, t.AvatarUrl, t.SortOrder));

    public async Task<TestimonialDto> CreateTestimonialAsync(UpsertTestimonialDto dto)
    {
        var t = new Testimonial { CustomerName = dto.CustomerName, City = dto.City, Occasion = dto.Occasion, Review = dto.Review, Rating = dto.Rating, AvatarUrl = dto.AvatarUrl, SortOrder = dto.SortOrder };
        _db.Testimonials.Add(t); await _db.SaveChangesAsync();
        return new TestimonialDto(t.Id, t.CustomerName, t.City, t.Occasion, t.Review, t.Rating, t.AvatarUrl, t.SortOrder);
    }

    public async Task<TestimonialDto?> UpdateTestimonialAsync(int id, UpsertTestimonialDto dto)
    {
        var t = await _db.Testimonials.FindAsync(id);
        if (t == null) return null;
        t.CustomerName = dto.CustomerName; t.City = dto.City; t.Occasion = dto.Occasion;
        t.Review = dto.Review; t.Rating = dto.Rating; t.AvatarUrl = dto.AvatarUrl; t.SortOrder = dto.SortOrder;
        await _db.SaveChangesAsync();
        return new TestimonialDto(t.Id, t.CustomerName, t.City, t.Occasion, t.Review, t.Rating, t.AvatarUrl, t.SortOrder);
    }

    public async Task<bool> DeleteTestimonialAsync(int id)
    {
        var t = await _db.Testimonials.FindAsync(id);
        if (t == null) return false;
        t.IsActive = false; await _db.SaveChangesAsync(); return true;
    }

    public async Task<IEnumerable<GalleryItemDto>> GetGalleryAsync(string? occasion = null)
    {
        var q = _db.GalleryItems.Where(g => g.IsActive);
        if (!string.IsNullOrEmpty(occasion)) q = q.Where(g => g.Occasion == occasion);
        return (await q.OrderBy(g => g.SortOrder).ToListAsync())
            .Select(g => new GalleryItemDto(g.Id, g.ImageUrl, g.Caption, g.Occasion, g.City, g.FlagType, g.QuantityOrdered, g.SortOrder));
    }

    public async Task<GalleryItemDto> CreateGalleryItemAsync(string imageUrl, UpsertGalleryItemDto dto)
    {
        var g = new GalleryItem { ImageUrl = imageUrl, Caption = dto.Caption, Occasion = dto.Occasion, City = dto.City, FlagType = dto.FlagType, QuantityOrdered = dto.QuantityOrdered, SortOrder = dto.SortOrder };
        _db.GalleryItems.Add(g); await _db.SaveChangesAsync();
        return new GalleryItemDto(g.Id, g.ImageUrl, g.Caption, g.Occasion, g.City, g.FlagType, g.QuantityOrdered, g.SortOrder);
    }

    public async Task<GalleryItemDto?> UpdateGalleryItemAsync(int id, UpsertGalleryItemDto dto)
    {
        var g = await _db.GalleryItems.FindAsync(id);
        if (g == null) return null;
        g.Caption = dto.Caption; g.Occasion = dto.Occasion; g.City = dto.City;
        g.FlagType = dto.FlagType; g.QuantityOrdered = dto.QuantityOrdered; g.SortOrder = dto.SortOrder;
        await _db.SaveChangesAsync();
        return new GalleryItemDto(g.Id, g.ImageUrl, g.Caption, g.Occasion, g.City, g.FlagType, g.QuantityOrdered, g.SortOrder);
    }

    public async Task<bool> DeleteGalleryItemAsync(int id)
    {
        var g = await _db.GalleryItems.FindAsync(id); if (g == null) return false;
        g.IsActive = false; await _db.SaveChangesAsync(); return true;
    }

    public async Task<IEnumerable<FaqDto>> GetFaqsAsync(string? category = null)
    {
        var q = _db.Faqs.Where(f => f.IsActive);
        if (!string.IsNullOrEmpty(category)) q = q.Where(f => f.Category == category);
        return (await q.OrderBy(f => f.SortOrder).ToListAsync())
            .Select(f => new FaqDto(f.Id, f.Question, f.Answer, f.Category, f.SortOrder));
    }

    public async Task<FaqDto> CreateFaqAsync(UpsertFaqDto dto)
    {
        var f = new Faq { Question = dto.Question, Answer = dto.Answer, Category = dto.Category, SortOrder = dto.SortOrder };
        _db.Faqs.Add(f); await _db.SaveChangesAsync();
        return new FaqDto(f.Id, f.Question, f.Answer, f.Category, f.SortOrder);
    }

    public async Task<FaqDto?> UpdateFaqAsync(int id, UpsertFaqDto dto)
    {
        var f = await _db.Faqs.FindAsync(id); if (f == null) return null;
        f.Question = dto.Question; f.Answer = dto.Answer; f.Category = dto.Category; f.SortOrder = dto.SortOrder;
        await _db.SaveChangesAsync();
        return new FaqDto(f.Id, f.Question, f.Answer, f.Category, f.SortOrder);
    }

    public async Task<bool> DeleteFaqAsync(int id)
    {
        var f = await _db.Faqs.FindAsync(id); if (f == null) return false;
        f.IsActive = false; await _db.SaveChangesAsync(); return true;
    }

    public async Task<IEnumerable<QuoteDto>> GetQuotesAsync() =>
        (await _db.Quotes.OrderByDescending(q => q.CreatedAt).ToListAsync()).Select(MapQuote);

    public async Task<QuoteDto> CreateQuoteAsync(QuoteRequestDto dto)
    {
        var q = new Quote
        {
            Name = dto.Name, Email = dto.Email, Phone = dto.Phone, FlagType = dto.FlagType,
            Size = dto.Size, Material = dto.Material, Quantity = dto.Quantity, Occasion = dto.Occasion,
            NeedsDesign = dto.NeedsDesign, DeliveryPincode = dto.DeliveryPincode,
            DeliveryType = Enum.Parse<DeliveryType>(dto.DeliveryType, true), Notes = dto.Notes
        };
        _db.Quotes.Add(q); await _db.SaveChangesAsync();
        return MapQuote(q);
    }

    public async Task<QuoteDto?> UpdateQuotePriceAsync(int id, decimal price)
    {
        var q = await _db.Quotes.FindAsync(id); if (q == null) return null;
        q.QuotedPrice = price; q.Status = QuoteStatus.Sent;
        await _db.SaveChangesAsync(); return MapQuote(q);
    }

    public async Task<IEnumerable<BlogPostDto>> GetBlogPostsAsync(bool publishedOnly = true)
    {
        var q = _db.BlogPosts.AsQueryable();
        if (publishedOnly) q = q.Where(b => b.IsPublished);
        return (await q.OrderByDescending(b => b.PublishedAt).ToListAsync()).Select(MapBlog);
    }

    public async Task<BlogPostDto?> GetBlogPostAsync(string slug)
    {
        var b = await _db.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);
        return b == null ? null : MapBlog(b);
    }

    public async Task<BlogPostDto> CreateBlogPostAsync(UpsertBlogPostDto dto)
    {
        var b = new BlogPost { Title = dto.Title, Slug = Slugify(dto.Title), Excerpt = dto.Excerpt, Content = dto.Content, CoverImageUrl = dto.CoverImageUrl, Tags = dto.Tags, IsPublished = dto.IsPublished, PublishedAt = dto.IsPublished ? DateTime.UtcNow : null };
        _db.BlogPosts.Add(b); await _db.SaveChangesAsync(); return MapBlog(b);
    }

    public async Task<BlogPostDto?> UpdateBlogPostAsync(int id, UpsertBlogPostDto dto)
    {
        var b = await _db.BlogPosts.FindAsync(id); if (b == null) return null;
        b.Title = dto.Title; b.Slug = Slugify(dto.Title); b.Excerpt = dto.Excerpt;
        b.Content = dto.Content; b.CoverImageUrl = dto.CoverImageUrl; b.Tags = dto.Tags;
        b.IsPublished = dto.IsPublished; b.UpdatedAt = DateTime.UtcNow;
        if (dto.IsPublished && b.PublishedAt == null) b.PublishedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(); return MapBlog(b);
    }

    public async Task<bool> DeleteBlogPostAsync(int id)
    {
        var b = await _db.BlogPosts.FindAsync(id); if (b == null) return false;
        _db.BlogPosts.Remove(b); await _db.SaveChangesAsync(); return true;
    }

    private static PageContentDto MapContent(PageContent c) =>
        new(c.Id, c.PageKey, c.Section, c.Title, c.Subtitle, c.Body, c.ImageUrl, c.CtaText, c.CtaLink, c.MetaJson);

    private static QuoteDto MapQuote(Quote q) =>
        new(q.Id, q.Name, q.Email, q.Phone, q.FlagType, q.Size, q.Material, q.Quantity, q.Occasion, q.NeedsDesign, q.DeliveryPincode, q.DeliveryType.ToString(), q.Notes, q.QuotedPrice, q.Status.ToString(), q.CreatedAt);

    private static BlogPostDto MapBlog(BlogPost b) =>
        new(b.Id, b.Title, b.Slug, b.Excerpt, b.Content, b.CoverImageUrl, b.Tags, b.IsPublished, b.PublishedAt);

    private static string Slugify(string name) =>
        System.Text.RegularExpressions.Regex.Replace(name.ToLower().Trim(), @"[^a-z0-9]+", "-").Trim('-');
}
