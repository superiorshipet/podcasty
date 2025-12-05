using Microsoft.EntityFrameworkCore;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Repos
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _db;

        public NotificationRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Notification>> GetByUserAsync(int userId)
        {
            return await _db.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)  // Limit to latest 50 notifications for performance
                .ToListAsync();
        }

        public async Task<Notification> GetByIdAsync(int id)
        {
            return await _db.Notifications.FindAsync(id);
        }

        public async Task<Notification> AddAsync(Notification notification)
        {
            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
            return notification;
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            // Optimized: direct update without loading entity
            var affected = await _db.Notifications
                .Where(n => n.NotificationId == id)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
            return affected > 0;
        }

        public async Task<bool> MarkAllAsReadAsync(int userId)
        {
            // Optimized: bulk update without loading entities
            await _db.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var affected = await _db.Notifications
                .Where(n => n.NotificationId == id)
                .ExecuteDeleteAsync();
            return affected > 0;
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _db.Notifications
                .AsNoTracking()
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        /// <summary>
        /// Create notifications for all followers of a podcast when a new episode is published
        /// </summary>
        public async Task CreateNotificationsForFollowersAsync(int podcastId, int episodeId, string podcastTitle, string episodeTitle)
        {
            // Get all users who follow this podcast - optimized query
            var followers = await _db.UserInteractions
                .AsNoTracking()
                .Where(ui => ui.PodcastId == podcastId && ui.Interaction == InteractionType.Follow)
                .Select(ui => ui.UserId)
                .Distinct()
                .ToListAsync();

            if (!followers.Any()) return;

            // Create notifications in batch
            var notifications = followers.Select(userId => new Notification
            {
                UserId = userId,
                PodcastId = podcastId,
                EpisodeId = episodeId,
                Title = $"New Episode from {podcastTitle}",
                Message = $"A new episode \"{episodeTitle}\" has been published!",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _db.Notifications.AddRange(notifications);
            await _db.SaveChangesAsync();
        }
    }
}
