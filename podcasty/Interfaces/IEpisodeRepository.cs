    using podcasty.Models;
using podcasty.Dtos;
namespace podcasty.Interfaces
{
    public interface IEpisodeRepository
    {
        Task<Episode> AddAsync(Episode episode);
        Task<Episode?> GetByIdAsync(int id);
        Task<List<Episode>> GetByPodcastAsync(int podcastId);
        Task<List<Episode>> GetAllAsync();
        Task<bool> UpdateAsync(Episode episode);
        Task<bool> DeleteAsync(int id);
        bool AdminEdit(int id, EpisodeUpdateDto dto);
        bool setApprovalStatus(int id, bool approved);
    }
}
