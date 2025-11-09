using Microsoft.EntityFrameworkCore;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Repos
{
    public class UserInteractionRepository(AppDbContext db) : IUserInteractionRepository
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
        public async Task<UserInteraction> GetInteractionByIdAsync(int id)
        {
            return await _db.UserInteractions.FindAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _db.UserInteractions.FindAsync(id);
            if (item == null) return false;
            _db.UserInteractions.Remove(item);
            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateCommentContent(int interactionId, int userId, string newContent)
        {
            var comment = await _db.UserInteractions
                .FirstOrDefaultAsync(ui =>
                    ui.InteractionId == interactionId &&
                    ui.Interaction == InteractionType.Comment &&
                    ui.UserId == userId);

            if (comment == null) return false;

            comment.CommentContent = newContent;
            comment.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return true;
        }

    }
}
