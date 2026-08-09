namespace Winflag.Infrastructure.Services;

public interface IStorageService
{
    Task<string> SaveFileAsync(Stream stream, string fileName, string folder);
    Task DeleteFileAsync(string url);
}

public class LocalStorageService : IStorageService
{
    private readonly string _root;
    private readonly string _baseUrl;

    public LocalStorageService(string webRootPath, string baseUrl)
    {
        _root = Path.Combine(webRootPath, "uploads");
        _baseUrl = baseUrl;
        Directory.CreateDirectory(_root);
    }

    public async Task<string> SaveFileAsync(Stream stream, string fileName, string folder)
    {
        var dir = Path.Combine(_root, folder);
        Directory.CreateDirectory(dir);
        var unique = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var path = Path.Combine(dir, unique);
        await using var fs = File.Create(path);
        await stream.CopyToAsync(fs);
        return $"{_baseUrl}/uploads/{folder}/{unique}";
    }

    public Task DeleteFileAsync(string url)
    {
        var relative = url.Replace(_baseUrl, "").TrimStart('/');
        var path = Path.Combine(_root, "..", relative);
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }
}
