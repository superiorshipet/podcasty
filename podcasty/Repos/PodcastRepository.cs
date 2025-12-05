using Microsoft.EntityFrameworkCore;
using podcasty.Models;
using podcasty.Interfaces;
using podcasty.Dtos;
using podcasty.Enums;

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
        {
            // First get podcast with creator (without episodes to avoid loading AudioFile)
            var podcast = await _db.Podcasts
                .AsNoTracking()
                .Include(p => p.Creator)
                .FirstOrDefaultAsync(p => p.PodcastId == id);
            
            if (podcast == null) return null;
            
            // Load episodes separately without AudioFile for performance
            var episodes = await _db.Episodes
                .AsNoTracking()
                .Where(e => e.PodcastId == id)
                .Select(e => new Episode
                {
                    EpisodeId = e.EpisodeId,
                    PodcastId = e.PodcastId,
                    Title = e.Title,
                    Description = e.Description,
                    CoverImage = e.CoverImage,
                    Duration = e.Duration,
                    EpisodeNumber = e.EpisodeNumber,
                    PlayCount = e.PlayCount,
                    PublishedAt = e.PublishedAt,
                    IsApproved = e.IsApproved,
                    AudioFile = "" // Don't load AudioFile - it's too large
                })
                .ToListAsync();
            
            podcast.Episodes = episodes;
            return podcast;
        }

        public async Task<List<Podcast>> GetAllAsync()
            => await _db.Podcasts
                .AsNoTracking()  // Performance: no change tracking
                .Include(p => p.Creator)  // Removed Episodes include - load separately when needed
                .Where(p => p.Creator == null || !p.Creator.IsBanned)
                .ToListAsync();

        public async Task<List<Podcast>> GetAllForAdminAsync()
            => await _db.Podcasts
                .AsNoTracking()  // Performance: no change tracking
                .Include(p => p.Creator)  // Removed Episodes include
                .ToListAsync();

        public async Task<List<Podcast>> GetByCategoryAsync(int categoryId)
            => await _db.Podcasts
                .AsNoTracking()  // Performance: no change tracking
                .Include(p => p.Creator)
                .Where(p => p.CategoryId == categoryId)
                .Where(p => p.Creator == null || !p.Creator.IsBanned)
                .ToListAsync();

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
            try
            {
                // Set longer timeout for delete operations
                _db.Database.SetCommandTimeout(120); // 2 minutes
                
                // Get all episode IDs for this podcast
                var episodeIds = await _db.Episodes
                    .Where(e => e.PodcastId == id)
                    .Select(e => e.EpisodeId)
                    .ToListAsync();

                // Delete notifications related to episodes
                if (episodeIds.Any())
                {
                    await _db.Notifications
                        .Where(n => episodeIds.Contains(n.EpisodeId ?? 0))
                        .ExecuteDeleteAsync();
                }

                // Delete notifications related to podcast
                await _db.Notifications
                    .Where(n => n.PodcastId == id)
                    .ExecuteDeleteAsync();

                // Delete play histories for episodes
                if (episodeIds.Any())
                {
                    await _db.PlayHistories
                        .Where(ph => episodeIds.Contains(ph.EpisodeId))
                        .ExecuteDeleteAsync();
                }

                // Delete all episodes for this podcast
                await _db.Episodes
                    .Where(e => e.PodcastId == id)
                    .ExecuteDeleteAsync();

                // Delete user interactions (likes, follows, comments) for this podcast
                await _db.UserInteractions
                    .Where(ui => ui.PodcastId == id)
                    .ExecuteDeleteAsync();

                // Finally delete the podcast
                var deleted = await _db.Podcasts
                    .Where(p => p.PodcastId == id)
                    .ExecuteDeleteAsync();

                return deleted > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DeleteAsync error: {ex.Message}");
                throw;
            }
        }
        
        public bool AdminEdit(int id, PodcastUpdateDto dto)
        {
            var podcast = _db.Podcasts.Find(id);
            if (podcast == null) return false;
            podcast.Title = dto.Title ?? podcast.Title;
            podcast.Description = dto.Description ?? podcast.Description;
            podcast.Status = dto.Status ?? podcast.Status;
            podcast.CategoryId = dto.CategoryId ?? podcast.CategoryId;
            podcast.CoverImage = dto.CoverImage ?? podcast.CoverImage;
            podcast.UpdatedAt = DateTime.UtcNow;
            _db.SaveChanges();
            return true;
        }

        public bool SetApprovalStatus(int id, bool approved)
        {
            var podcast = _db.Podcasts.FirstOrDefault(p => p.PodcastId == id);
            if (podcast == null) return false;
            podcast.IsApproved = approved;
            _db.SaveChanges();
            return true;
        }

        public async Task<PodcastStatsDto> GetPodcastStatsAsync(int podcastId)
        {
            // Optimized: single query with projection
            var stats = await _db.Podcasts
                .AsNoTracking()
                .Where(p => p.PodcastId == podcastId)
                .Select(p => new PodcastStatsDto
                {
                    PodcastId = podcastId,
                    LikesCount = _db.UserInteractions.Count(ui => ui.PodcastId == podcastId && ui.Interaction == InteractionType.Like),
                    FollowersCount = _db.UserInteractions.Count(ui => ui.PodcastId == podcastId && ui.Interaction == InteractionType.Follow),
                    PlayCount = p.PlayCount
                })
                .FirstOrDefaultAsync();

            return stats ?? new PodcastStatsDto { PodcastId = podcastId };
        }
    }
}