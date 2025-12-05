using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetByUserAsync(int userId);
        Task<Notification> GetByIdAsync(int id);
        Task<Notification> AddAsync(Notification notification);
        Task<bool> MarkAsReadAsync(int id);
        Task<bool> MarkAllAsReadAsync(int userId);
        Task<bool> DeleteAsync(int id);
        Task<int> GetUnreadCountAsync(int userId);
        Task CreateNotificationsForFollowersAsync(int podcastId, int episodeId, string podcastTitle, string episodeTitle);
    }
}
