using podcasty.Models;
using podcasty.Dtos;
namespace podcasty.Interfaces
{
    public interface ICategoryRepository
    {
        Task<Category> AddAsync(Category category);
        Task<Category?> GetByIdAsync(int id);
        Task<List<Category>> GetAllAsync();
        Task<bool> UpdateAsync(Category category);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> UpdateAsync(int id, CategoryDto dto);
        Task<Category> AddAsync(CategoryDto dto); 



    }
}
