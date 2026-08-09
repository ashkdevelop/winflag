using Winflag.Core.Entities;

namespace Winflag.Application.DTOs;

public record OrderItemDto(int Id, string ProductName, string Size, string Material, int Quantity, decimal UnitPrice, decimal TotalPrice);

public record OrderDto(
    int Id, string OrderNumber, string CustomerName, string CustomerEmail, string CustomerPhone,
    string? GstNumber, string DeliveryAddress, string DeliveryPincode, string DeliveryCity, string DeliveryState,
    DeliveryType DeliveryType, OrderStatus Status, decimal SubTotal, decimal GstAmount,
    decimal DeliveryCharge, decimal TotalAmount, string? DesignFileUrl, string? Notes,
    string? TrackingNumber, bool IsPaid, DateTime CreatedAt, List<OrderItemDto> Items);

public record PlaceOrderDto(
    string CustomerName, string CustomerEmail, string CustomerPhone,
    string? GstNumber, string DeliveryAddress, string DeliveryPincode,
    string DeliveryCity, string DeliveryState, DeliveryType DeliveryType,
    string? Notes, List<PlaceOrderItemDto> Items);

public record PlaceOrderItemDto(int ProductId, string Size, string Material, int Quantity);

public record UpdateOrderStatusDto(OrderStatus Status, string? TrackingNumber);
