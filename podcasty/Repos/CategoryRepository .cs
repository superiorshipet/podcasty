using Microsoft.EntityFrameworkCore;
using podcasty.Models;
using podcasty.Interfaces;

namespace podcasty.Repos;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _db;

    public CategoryRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Category> AddAsync(Category category)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task<Category> GetByIdAsync(int id)
    {
        return await _db.Categories.FindAsync(id);
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _db.Categories.ToListAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _db.Categories.AnyAsync(c => c.CategoryId == id);
    }
    public async Task<bool> UpdateAsync(Category category)
    {
        var existingCategory = await _db.Categories.FindAsync(category.CategoryId);
        if (existingCategory == null)
        {
            return false;
        }
        existingCategory.Name = category.Name;
        existingCategory.Icon = category.Icon;
        await _db.SaveChangesAsync();
        return true;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null)
        {
            return false;
        }
        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return true;
    }
  
}
