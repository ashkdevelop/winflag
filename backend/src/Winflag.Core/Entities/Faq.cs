namespace Winflag.Core.Entities;

public class Faq
{
    public int Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = "General";   // Ordering, Design, Delivery, Quality, Billing
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
