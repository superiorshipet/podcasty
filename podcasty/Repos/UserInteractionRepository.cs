using Microsoft.EntityFrameworkCore;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;
using System.Collections.Generic; // لـ IEnumerable
using System.Linq;                 // لـ Where, OrderBy, FirstOrDefault
using System.Threading.Tasks;      // لـ Task و await

namespace podcasty.Repos
{
    public class UserInteractionRepository : IUserInteractionRepository
    {
        private readonly AppDbContext _db;

        public UserInteractionRepository(AppDbContext db)
        {
            _db = db;
        }

        // 1. دالة البحث عن تفاعل موجود (لأجل Toggle Logic)
        public async Task<UserInteraction?> GetExistingInteractionAsync(int userId, int podcastId, InteractionType interactionType)
        {
            return await _db.UserInteractions
                .FirstOrDefaultAsync(ui =>
                    ui.UserId == userId &&
                    ui.PodcastId == podcastId &&
                    ui.Interaction == interactionType);
        }

        // 2. جلب التعليقات حسب البودكاست (مع ضم المستخدم)
        public async Task<IEnumerable<UserInteraction>> GetByPodcastAsync(int podcastId) =>
            await _db.UserInteractions
                .Include(ui => ui.User)
                .Where(u => u.PodcastId == podcastId)
                .OrderByDescending(ui => ui.CreatedAt)
                .ToListAsync();

        // 3. جلب التفاعلات حسب المستخدم (لصفحة MyLibrary)
        public async Task<IEnumerable<UserInteraction>> GetByUserAsync(int userId) =>
            await _db.UserInteractions
                .Include(ui => ui.User)
                .Where(u => u.UserId == userId)
                .ToListAsync();

        // 4. دالة الإضافة (Add)
        public async Task<UserInteraction> AddAsync(UserInteraction interaction)
        {
            System.Diagnostics.Debug.WriteLine($"💾 AddAsync: Adding interaction UserId={interaction.UserId}, PodcastId={interaction.PodcastId}, Type={interaction.Interaction}");
            _db.UserInteractions.Add(interaction);
            await _db.SaveChangesAsync();
            System.Diagnostics.Debug.WriteLine($"✅ AddAsync: Saved successfully");
            return interaction;
        }

        // 5. دالة الحذف (Delete) - Optimized
        public async Task<bool> DeleteAsync(int id)
        {
            var deleted = await _db.UserInteractions
                .Where(ui => ui.InteractionId == id)
                .ExecuteDeleteAsync();
            return deleted > 0;
        }

        // 6. تحديث محتوى التعليق (UpdateCommentContent)
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

        // 7. جلب تفاعل حسب الـ ID (GetInteractionByIdAsync)
        public async Task<UserInteraction> GetInteractionByIdAsync(int id)
        {
            return await _db.UserInteractions.FindAsync(id);
        }

        public async Task<UserInteraction> GetByIdAsync(int id)
        {
            return await _db.UserInteractions.FindAsync(id);
        }

        // 8. جلب تعليق محدد (GetCommentByIdAsync)
        public async Task<UserInteraction> GetCommentByIdAsync(int commentId)
        {
            return await _db.UserInteractions
                .FirstOrDefaultAsync(ui =>
                    ui.InteractionId == commentId &&
                    ui.Interaction == InteractionType.Comment);
        }

        // 9. جلب تعليقات المستخدم (GetCommentsAsync)
        public async Task<UserInteraction> GetCommentsAsync(int userId)
        {
            return await _db.UserInteractions
                .FirstOrDefaultAsync(ui =>
                    ui.UserId == userId &&
                    ui.Interaction == InteractionType.Comment);
        }

        // 10. جلب أول تفاعل (GetAllAsync)
        public async Task<UserInteraction> GetAllAsync()
        {
            return await _db.UserInteractions.FirstOrDefaultAsync();
        }
    }
}