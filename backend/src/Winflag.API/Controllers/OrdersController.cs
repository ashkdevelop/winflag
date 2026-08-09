using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Winflag.Application.DTOs;
using Winflag.Infrastructure.Services;
using Winflag.Core.Entities;

namespace Winflag.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;
    private readonly IMediaService _media;

    public OrdersController(IOrderService orders, IMediaService media)
    {
        _orders = orders;
        _media = media;
    }

    [HttpPost]
    public async Task<IActionResult> Place(PlaceOrderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var order = await _orders.PlaceOrderAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var o = await _orders.GetByIdAsync(id);
        return o == null ? NotFound() : Ok(o);
    }

    [HttpGet("track/{orderNumber}")]
    public async Task<IActionResult> Track(string orderNumber)
    {
        var o = await _orders.GetByOrderNumberAsync(orderNumber);
        return o == null ? NotFound() : Ok(o);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> MyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        return Ok(await _orders.GetByUserAsync(userId));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] OrderStatus? status)
        => Ok(await _orders.GetAllAsync(status));

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
    {
        var o = await _orders.UpdateStatusAsync(id, dto);
        return o == null ? NotFound() : Ok(o);
    }

    [HttpPost("{id:int}/design")]
    public async Task<IActionResult> UploadDesign(int id, IFormFile file)
    {
        var asset = await _media.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType, "designs", null);
        var ok = await _orders.SetDesignFileAsync(id, asset.Url);
        return ok ? Ok(new { url = asset.Url }) : NotFound();
    }
}
