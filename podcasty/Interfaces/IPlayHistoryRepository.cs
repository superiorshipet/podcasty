using podcasty.Dtos;
using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IPlayHistoryRepository
    {
        Task<PlayHistory> AddAsync(int userId, PlayHistoryCreateDto dto);
        Task<PlayHistory> UpdateAsync(int userId, int historyId, PlayHistoryCreateDto dto);
        Task<bool> DeleteAsync(int userId, int historyId);
        Task<List<PlayHistory>> GetByUserAsync(int userId);
    }
}
