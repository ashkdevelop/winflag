namespace Winflag.Core.Entities;

public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string Size { get; set; } = string.Empty;
    public string Material { get; set; } = string.Empty;
    public decimal PricePerUnit { get; set; }
    public string? Dimensions { get; set; }
    public bool IsActive { get; set; } = true;
}
