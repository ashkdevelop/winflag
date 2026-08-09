using Microsoft.EntityFrameworkCore;
using Winflag.Application.DTOs;
using Winflag.Core.Entities;
using Winflag.Infrastructure.Data;

namespace Winflag.Infrastructure.Services;

public interface IOrderService
{
    Task<OrderDto> PlaceOrderAsync(PlaceOrderDto dto, string? userId = null);
    Task<OrderDto?> GetByIdAsync(int id);
    Task<OrderDto?> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<OrderDto>> GetAllAsync(OrderStatus? status = null);
    Task<IEnumerable<OrderDto>> GetByUserAsync(string userId);
    Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto);
    Task<bool> SetDesignFileAsync(int id, string fileUrl);
}

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db) => _db = db;

    public async Task<OrderDto> PlaceOrderAsync(PlaceOrderDto dto, string? userId = null)
    {
        var orderNumber = $"WF-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
        var items = new List<OrderItem>();
        decimal subTotal = 0;

        foreach (var item in dto.Items)
        {
            var variant = await _db.ProductVariants
                .Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.ProductId == item.ProductId && v.Size == item.Size && v.Material == item.Material);

            decimal unitPrice = variant?.PricePerUnit ?? 0;
            var product = await _db.Products.FindAsync(item.ProductId);
            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = product?.Name ?? string.Empty,
                Size = item.Size,
                Material = item.Material,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = unitPrice * item.Quantity
            };
            items.Add(orderItem);
            subTotal += orderItem.TotalPrice;
        }

        decimal gst = subTotal * 0.18m;
        decimal delivery = dto.DeliveryType == DeliveryType.Express ? 500m : 150m;

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = userId,
            CustomerName = dto.CustomerName,
            CustomerEmail = dto.CustomerEmail,
            CustomerPhone = dto.CustomerPhone,
            GstNumber = dto.GstNumber,
            DeliveryAddress = dto.DeliveryAddress,
            DeliveryPincode = dto.DeliveryPincode,
            DeliveryCity = dto.DeliveryCity,
            DeliveryState = dto.DeliveryState,
            DeliveryType = dto.DeliveryType,
            SubTotal = subTotal,
            GstAmount = gst,
            DeliveryCharge = delivery,
            TotalAmount = subTotal + gst + delivery,
            Notes = dto.Notes,
            Items = items
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return MapOrder(order);
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        return order == null ? null : MapOrder(order);
    }

    public async Task<OrderDto?> GetByOrderNumberAsync(string orderNumber)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
        return order == null ? null : MapOrder(order);
    }

    public async Task<IEnumerable<OrderDto>> GetAllAsync(OrderStatus? status = null)
    {
        var q = _db.Orders.Include(o => o.Items).AsQueryable();
        if (status.HasValue) q = q.Where(o => o.Status == status);
        return (await q.OrderByDescending(o => o.CreatedAt).ToListAsync()).Select(MapOrder);
    }

    public async Task<IEnumerable<OrderDto>> GetByUserAsync(string userId)
    {
        return (await _db.Orders.Include(o => o.Items).Where(o => o.UserId == userId).OrderByDescending(o => o.CreatedAt).ToListAsync()).Select(MapOrder);
    }

    public async Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return null;
        order.Status = dto.Status;
        if (dto.TrackingNumber != null) order.TrackingNumber = dto.TrackingNumber;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapOrder(order);
    }

    public async Task<bool> SetDesignFileAsync(int id, string fileUrl)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return false;
        order.DesignFileUrl = fileUrl;
        await _db.SaveChangesAsync();
        return true;
    }

    private static OrderDto MapOrder(Order o) => new(
        o.Id, o.OrderNumber, o.CustomerName, o.CustomerEmail, o.CustomerPhone,
        o.GstNumber, o.DeliveryAddress, o.DeliveryPincode, o.DeliveryCity, o.DeliveryState,
        o.DeliveryType, o.Status, o.SubTotal, o.GstAmount, o.DeliveryCharge, o.TotalAmount,
        o.DesignFileUrl, o.Notes, o.TrackingNumber, o.IsPaid, o.CreatedAt,
        o.Items.Select(i => new OrderItemDto(i.Id, i.ProductName, i.Size, i.Material, i.Quantity, i.UnitPrice, i.TotalPrice)).ToList()
    );
}
