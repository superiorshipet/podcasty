using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IEpisodeRepository
    {
        Task<Episode> AddAsync(Episode episode);
        Task<Episode?> GetByIdAsync(int id);
        Task<List<Episode>> GetByPodcastAsync(int podcastId);
        Task<bool> UpdateAsync(Episode episode);
        Task<bool> DeleteAsync(int id);
    }
}
