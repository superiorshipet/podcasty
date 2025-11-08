using podcasty.DTOs;
using podcasty.Models;

namespace podcasty.Repositories
{
    public interface IPlayHistoryRepository
    {
        Task<List<PlayHistoryDetailsDto>> GetPlayHistoryAsync(int userId);
        Task UpdateProgressAsync(int userid,UpdateProgressDataDto playHistory);
    }
}
