namespace Winflag.Core.Entities;

public class Testimonial
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Occasion { get; set; } = string.Empty;
    public string Review { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
