using Microsoft.EntityFrameworkCore;
using Winflag.Application.DTOs;
using Winflag.Core.Entities;
using Winflag.Infrastructure.Data;
using Winflag.Infrastructure.Services;

namespace Winflag.Infrastructure.Services;

public interface IMediaService
{
    Task<MediaAssetDto> UploadAsync(Stream stream, string fileName, string contentType, string? folder, string? altText);
    Task<IEnumerable<MediaAssetDto>> GetAllAsync(string? folder = null);
    Task<bool> DeleteAsync(int id);
}

public class MediaService : IMediaService
{
    private readonly AppDbContext _db;
    private readonly IStorageService _storage;

    public MediaService(AppDbContext db, IStorageService storage)
    {
        _db = db;
        _storage = storage;
    }

    public async Task<MediaAssetDto> UploadAsync(Stream stream, string fileName, string contentType, string? folder, string? altText)
    {
        var f = folder ?? "general";
        var url = await _storage.SaveFileAsync(stream, fileName, f);
        var asset = new MediaAsset { FileName = fileName, Url = url, AltText = altText, Folder = f, ContentType = contentType, SizeBytes = stream.Length };
        _db.MediaAssets.Add(asset);
        await _db.SaveChangesAsync();
        return Map(asset);
    }

    public async Task<IEnumerable<MediaAssetDto>> GetAllAsync(string? folder = null)
    {
        var q = _db.MediaAssets.AsQueryable();
        if (!string.IsNullOrEmpty(folder)) q = q.Where(m => m.Folder == folder);
        return (await q.OrderByDescending(m => m.UploadedAt).ToListAsync()).Select(Map);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var asset = await _db.MediaAssets.FindAsync(id);
        if (asset == null) return false;
        await _storage.DeleteFileAsync(asset.Url);
        _db.MediaAssets.Remove(asset);
        await _db.SaveChangesAsync();
        return true;
    }

    private static MediaAssetDto Map(MediaAsset m) =>
        new(m.Id, m.FileName, m.Url, m.AltText, m.Folder, m.SizeBytes, m.UploadedAt);
}
