namespace Winflag.Application.DTOs;

public record RegisterDto(string FullName, string Email, string Password, string? Phone, string? Company);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string UserId, string Email, string FullName, IList<string> Roles);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);
