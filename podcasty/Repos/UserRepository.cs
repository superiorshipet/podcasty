using Microsoft.AspNetCore.Identity;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Repos
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _db;
        
        public UserRepository(UserManager<User> userManager, AppDbContext db)
        {
            _userManager = userManager;
            _db = db;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userManager.FindByIdAsync(id.ToString());
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
        
        public IEnumerable<User> GetByEmail(string email)
        {
            return _userManager.Users.Where(u => u.Email == email).ToList();
        }
        
        public IEnumerable<User> GetAll()
        {
            return _userManager.Users.ToList();
        }
        
        public bool ChangeRole(int id, string newRole)
        {
            var user = _userManager.FindByIdAsync(id.ToString()).Result;
            if (user == null) return false;
            var removeResult = _userManager.RemoveFromRolesAsync(user, _userManager.GetRolesAsync(user).Result).Result;
            if (!removeResult.Succeeded) return false;
            var addResult = _userManager.AddToRoleAsync(user, newRole).Result;
            return addResult.Succeeded;
        }
        
        public bool SetBanStatus(int id, bool banned)
        {
            var user = _userManager.FindByIdAsync(id.ToString()).Result;
            if (user == null) return false;
            user.IsBanned = banned;
            var result = _userManager.UpdateAsync(user).Result;
            return result.Succeeded;
        }
        
        public bool Delete(int id)
        {
            var user = _userManager.FindByIdAsync(id.ToString()).Result;
            if (user == null) return false;
            
            // Delete all user's notifications
            var notifications = _db.Notifications.Where(n => n.UserId == id).ToList();
            _db.Notifications.RemoveRange(notifications);
            
            // Delete all user's play history
            var playHistory = _db.PlayHistories.Where(ph => ph.UserId == id).ToList();
            _db.PlayHistories.RemoveRange(playHistory);
            
            // Delete all user's interactions (likes, comments, follows, favorites)
            var interactions = _db.UserInteractions.Where(ui => ui.UserId == id).ToList();
            _db.UserInteractions.RemoveRange(interactions);
            
            // Get all user's podcasts
            var podcasts = _db.Podcasts.Where(p => p.CreatorId == id).ToList();
            foreach (var podcast in podcasts)
            {
                // Delete all play history for podcast's episodes
                var episodeIds = _db.Episodes.Where(e => e.PodcastId == podcast.PodcastId).Select(e => e.EpisodeId).ToList();
                var episodePlayHistory = _db.PlayHistories.Where(ph => episodeIds.Contains(ph.EpisodeId)).ToList();
                _db.PlayHistories.RemoveRange(episodePlayHistory);
                
                // Delete notifications related to podcast
                var podcastNotifications = _db.Notifications.Where(n => n.PodcastId == podcast.PodcastId).ToList();
                _db.Notifications.RemoveRange(podcastNotifications);
                
                // Delete all interactions for this podcast
                var podcastInteractions = _db.UserInteractions.Where(ui => ui.PodcastId == podcast.PodcastId).ToList();
                _db.UserInteractions.RemoveRange(podcastInteractions);
                
                // Delete all episodes of this podcast
                var episodes = _db.Episodes.Where(e => e.PodcastId == podcast.PodcastId).ToList();
                _db.Episodes.RemoveRange(episodes);
            }
            
            // Delete all user's podcasts
            _db.Podcasts.RemoveRange(podcasts);
            
            // Delete moderation logs related to user
            var moderationLogs = _db.ModerationLogs.Where(m => m.AdminId == id).ToList();
            _db.ModerationLogs.RemoveRange(moderationLogs);
            
            // Save all deletions
            _db.SaveChanges();
            
            // Finally delete the user
            var result = _userManager.DeleteAsync(user).Result;
            return result.Succeeded;
        }
        
        public IEnumerable<User> GetByName(string name)
        {
            return _userManager.Users.Where(u => u.UserName.Contains(name)).ToList();
        }
    }
}
