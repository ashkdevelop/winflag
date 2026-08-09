namespace Winflag.Core.Entities;

public class GalleryItem
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public string Occasion { get; set; } = string.Empty;   // Political, Sports, Corporate, etc.
    public string? City { get; set; }
    public string? FlagType { get; set; }
    public int? QuantityOrdered { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
