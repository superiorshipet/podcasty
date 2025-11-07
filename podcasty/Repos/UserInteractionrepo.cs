using Microsoft.EntityFrameworkCore;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Repos
{
    public class UserInteractionrepo(AppDbContext db) : IUserInteractionRepository
    {
        private readonly AppDbContext _db = db;

        public async Task<IEnumerable<UserInteraction>> GetByPodcastAsync(int podcastId) =>
            await _db.UserInteractions.Where(u => u.PodcastId == podcastId).ToListAsync();

        public async Task<IEnumerable<UserInteraction>> GetByUserAsync(int userId) =>
            await _db.UserInteractions.Where(u => u.UserId == userId).ToListAsync();

        public async Task<UserInteraction> AddAsync(UserInteraction interaction)
        {
            _db.UserInteractions.Add(interaction);
            await _db.SaveChangesAsync();
            return interaction;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _db.UserInteractions.FindAsync(id);
            if (item == null) return false;
            _db.UserInteractions.Remove(item);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
