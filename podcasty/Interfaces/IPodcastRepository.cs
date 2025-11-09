using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IPodcastRepository
    {
        Task<Podcast> AddAsync(Podcast podcast);
        Task<Podcast?> GetByIdAsync(int id);
        Task<List<Podcast>> GetAllAsync();
        Task<List<Podcast>> GetByCategoryAsync(int categoryId);
        Task<bool> UpdateAsync(Podcast podcast);
        Task<bool> DeleteAsync(int id);
    }
}