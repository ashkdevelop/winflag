namespace Winflag.Core.Entities;

public enum OrderStatus
{
    Pending,
    DesignApproved,
    InProduction,
    QualityCheck,
    Dispatched,
    Delivered,
    Cancelled
}

public enum DeliveryType
{
    Standard,
    Express
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? GstNumber { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public string DeliveryPincode { get; set; } = string.Empty;
    public string DeliveryCity { get; set; } = string.Empty;
    public string DeliveryState { get; set; } = string.Empty;
    public DeliveryType DeliveryType { get; set; } = DeliveryType.Standard;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal SubTotal { get; set; }
    public decimal GstAmount { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal TotalAmount { get; set; }
    public string? DesignFileUrl { get; set; }
    public string? Notes { get; set; }
    public string? TrackingNumber { get; set; }
    public string? PaymentId { get; set; }
    public bool IsPaid { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
