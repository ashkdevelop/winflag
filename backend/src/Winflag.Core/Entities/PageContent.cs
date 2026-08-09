namespace Winflag.Core.Entities;

public class PageContent
{
    public int Id { get; set; }
    public string PageKey { get; set; } = string.Empty;   // e.g. "home_hero", "about_intro"
    public string Section { get; set; } = string.Empty;   // e.g. "hero", "features"
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Body { get; set; }
    public string? ImageUrl { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public string? MetaJson { get; set; }                 // extra key-value pairs as JSON
    public bool IsActive { get; set; } = true;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
