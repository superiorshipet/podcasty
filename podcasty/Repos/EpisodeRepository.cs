using podcasty.Models;
using podcasty.Interfaces;
using Microsoft.EntityFrameworkCore;
using podcasty.Dtos;

namespace podcasty.Repos
{
    public class EpisodeRepository : IEpisodeRepository
    {
        private readonly AppDbContext _db;
        public EpisodeRepository(AppDbContext db) => _db = db;

        public async Task<Episode> AddAsync(Episode episode)
        {
            _db.Episodes.Add(episode);
            await _db.SaveChangesAsync();
            return episode;
        }

        public async Task<Episode?> GetByIdAsync(int id)
            => await _db.Episodes.AsNoTracking().FirstOrDefaultAsync(e => e.EpisodeId == id);

        public async Task<List<Episode>> GetByPodcastAsync(int podcastId)
            => await _db.Episodes
                .AsNoTracking()
                .Where(e => e.PodcastId == podcastId)
                .ToListAsync();

        public async Task<bool> UpdateAsync(Episode updated)
        {
            var ep = await _db.Episodes.FindAsync(updated.EpisodeId);
            if (ep == null) return false;
            ep.Title = updated.Title;
            ep.Description = updated.Description;
            ep.AudioFile = updated.AudioFile;
            ep.Duration = updated.Duration;
            ep.EpisodeNumber = updated.EpisodeNumber;
            ep.PlayCount = updated.PlayCount;
            ep.PublishedAt = updated.PublishedAt;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                // Set longer timeout for delete operations
                _db.Database.SetCommandTimeout(120); // 2 minutes
                
                // First delete related Notifications (if any)
                await _db.Notifications.Where(n => n.EpisodeId == id).ExecuteDeleteAsync();
                
                // Then delete related PlayHistory records (if any)
                await _db.PlayHistories.Where(ph => ph.EpisodeId == id).ExecuteDeleteAsync();
                
                // Finally delete the episode
                var deleted = await _db.Episodes.Where(e => e.EpisodeId == id).ExecuteDeleteAsync();
                
                return deleted > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DeleteAsync error: {ex.Message}");
                throw;
            }
        }

        public async Task<List<Episode>> GetAllAsync()
            => await _db.Episodes.AsNoTracking().ToListAsync();

        public bool AdminEdit(int id, EpisodeUpdateDto dto)
        {
            var ep = _db.Episodes.Find(id);
            if (ep == null) return false;
            ep.Title = dto.Title ?? ep.Title;
            ep.Description = dto.Description ?? ep.Description;
            ep.AudioFile = dto.AudioFile ?? ep.AudioFile;
            ep.Duration = dto.Duration ?? ep.Duration;
            ep.EpisodeNumber = dto.EpisodeNumber ?? ep.EpisodeNumber;
            ep.PlayCount = dto.PlayCount ?? ep.PlayCount;
            ep.PublishedAt = dto.PublishedAt ?? ep.PublishedAt;
            _db.SaveChanges();
            return true;
        }

        public bool setApprovalStatus(int id, bool approved)
        {
            var ep = _db.Episodes.Find(id);
            if (ep == null) return false;
            ep.IsApproved = approved;
            _db.SaveChanges();
            return true;
        }
    }
}
