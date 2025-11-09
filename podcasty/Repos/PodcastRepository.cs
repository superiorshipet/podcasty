using Microsoft.EntityFrameworkCore;
using podcasty.Models;
using podcasty.Interfaces;

namespace podcasty.Repos
{
    public class PodcastRepository : IPodcastRepository
    {
        private readonly AppDbContext _db;
        public PodcastRepository(AppDbContext db) => _db = db;

        public async Task<Podcast> AddAsync(Podcast podcast)
        {
            podcast.CreatedAt = DateTime.UtcNow;
            podcast.UpdatedAt = DateTime.UtcNow;
            _db.Podcasts.Add(podcast);
            await _db.SaveChangesAsync();
            return podcast;
        }

        public async Task<Podcast?> GetByIdAsync(int id)
            => await _db.Podcasts.Include(p => p.Episodes).FirstOrDefaultAsync(p => p.PodcastId == id);

        public async Task<List<Podcast>> GetAllAsync()
            => await _db.Podcasts.Include(p => p.Episodes).ToListAsync();

        public async Task<List<Podcast>> GetByCategoryAsync(int categoryId)
            => await _db.Podcasts.Where(p => p.CategoryId == categoryId).ToListAsync();

        public async Task<bool> UpdateAsync(Podcast updated)
        {
            var podcast = await _db.Podcasts.FindAsync(updated.PodcastId);
            if (podcast == null) return false;
            podcast.Title = updated.Title;
            podcast.Description = updated.Description;
            podcast.Status = updated.Status;
            podcast.UpdatedAt = DateTime.UtcNow;
            podcast.CategoryId = updated.CategoryId;
            podcast.CoverImage = updated.CoverImage;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var podcast = await _db.Podcasts.FindAsync(id);
            if (podcast == null) return false;
            _db.Podcasts.Remove(podcast);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
    