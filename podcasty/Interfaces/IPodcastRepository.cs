using podcasty.Dtos;
using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IPodcastRepository
    {
        Task<Podcast> AddAsync(Podcast podcast);
        Task<Podcast?> GetByIdAsync(int id);
        Task<List<Podcast>> GetAllAsync();
        Task<List<Podcast>> GetAllForAdminAsync();  // Returns all podcasts including banned users
        Task<List<Podcast>> GetByCategoryAsync(int categoryId);
        Task<bool> UpdateAsync(Podcast podcast);
        Task<bool> DeleteAsync(int id);
        bool AdminEdit(int id, PodcastUpdateDto dto);
        bool SetApprovalStatus(int id, bool approved);
        Task<PodcastStatsDto> GetPodcastStatsAsync(int podcastId);
    }
}