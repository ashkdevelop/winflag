namespace Winflag.Core.Entities;

public enum QuoteStatus { New, InReview, Sent, Accepted, Expired }

public class Quote
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string FlagType { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Material { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Occasion { get; set; } = string.Empty;
    public bool NeedsDesign { get; set; }
    public string? DesignFileUrl { get; set; }
    public string DeliveryPincode { get; set; } = string.Empty;
    public DeliveryType DeliveryType { get; set; } = DeliveryType.Standard;
    public string? Notes { get; set; }
    public decimal? QuotedPrice { get; set; }
    public QuoteStatus Status { get; set; } = QuoteStatus.New;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
