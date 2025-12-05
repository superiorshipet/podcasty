using Microsoft.EntityFrameworkCore;
using podcasty.Dtos;
using podcasty.Enums;
using podcasty.Interfaces;

namespace podcasty.Repos
{
    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly AppDbContext _db;

        public AnalyticsRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<AdminStatsDto> GetStatsAsync()
        {
            // Run queries sequentially to avoid DbContext concurrency issues
            var totalPodcasts = await _db.Podcasts.AsNoTracking().CountAsync();
            var totalPodcastPlays = await _db.Podcasts.AsNoTracking().SumAsync(p => p.PlayCount);
            var totalEpisodes = await _db.Episodes.AsNoTracking().CountAsync();
            var totalUsers = await _db.Users.AsNoTracking().CountAsync();
            var totalComments = await _db.UserInteractions.AsNoTracking()
                .Where(x => x.Interaction == InteractionType.Comment)
                .CountAsync();

            return new AdminStatsDto
            {
                TotalPodcasts = totalPodcasts,
                TotalEpisodes = totalEpisodes,
                TotalUsers = totalUsers,
                TotalComments = totalComments,
                TotalPodcastPlays = totalPodcastPlays,
            };
        }

        public async Task<List<TopPodcastDto>> GetTopPodcastsAsync(int count)
        {
            return await _db.Podcasts
                .AsNoTracking()
                .OrderByDescending(p => p.PlayCount)
                .Take(count)
                .Select(p => new TopPodcastDto
                {
                    PodcastId = p.PodcastId,
                    Title = p.Title,
                    PlayCount = p.PlayCount,
                })
                .ToListAsync();
        }

        public async Task<List<TopUserDto>> GetTopUsersAsync(int count)
        {
            // Optimized: using GroupBy instead of N+1 subquery
            var interactionCounts = await _db.UserInteractions
                .AsNoTracking()
                .GroupBy(x => x.UserId)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(count)
                .ToListAsync();

            var userIds = interactionCounts.Select(x => x.UserId).ToList();
            var users = await _db.Users
                .AsNoTracking()
                .Where(u => userIds.Contains(u.Id))
                .Select(u => new { u.Id, u.UserName })
                .ToListAsync();

            return interactionCounts.Select(ic => new TopUserDto
            {
                UserId = ic.UserId,
                UserName = users.FirstOrDefault(u => u.Id == ic.UserId)?.UserName ?? "Unknown",
                InteractionCount = ic.Count
            }).ToList();
        }

        public async Task<List<PodcastReportDto>> GetPodcastReportsAsync(DateTime start, DateTime end)
        {
            return await _db.Podcasts
                .AsNoTracking()
                .Where(p => p.CreatedAt >= start && p.CreatedAt <= end)
                .Select(p => new PodcastReportDto
                {
                    PodcastId = p.PodcastId,
                    Title = p.Title,
                    CreatedAt = p.CreatedAt,
                    PlayCount = p.PlayCount,
                })
                .ToListAsync();
        }
    }
}
