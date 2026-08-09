using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Winflag.Core.Interfaces;
using Winflag.Infrastructure.Data;

namespace Winflag.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<T> _set;

    public Repository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id) => await _set.FindAsync(id);
    public async Task<IEnumerable<T>> GetAllAsync() => await _set.ToListAsync();
    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        => await _set.Where(predicate).ToListAsync();
    public async Task<T> AddAsync(T entity) { await _set.AddAsync(entity); return entity; }
    public Task UpdateAsync(T entity) { _set.Update(entity); return Task.CompletedTask; }
    public Task DeleteAsync(T entity) { _set.Remove(entity); return Task.CompletedTask; }
    public async Task<int> SaveChangesAsync() => await _db.SaveChangesAsync();
}
