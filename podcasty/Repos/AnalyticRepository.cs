using Microsoft.EntityFrameworkCore;
using podcasty.Dtos;
using podcasty.Enums;
using podcasty.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            var totalPodcasts = await _db.Podcasts.CountAsync();
            var totalEpisodes = await _db.Episodes.CountAsync();
            var totalUsers = await _db.Users.CountAsync();
            var totalComments = await _db.UserInteractions
                .Where(x => x.Interaction == InteractionType.Comment)
                .CountAsync();
            var totalPodcastPlays = await _db.Podcasts.SumAsync(p => p.PlayCount);
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
            return await _db.Users
                .Select(u => new TopUserDto
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    InteractionCount = _db.UserInteractions.Count(x => x.UserId == u.Id)
                })
                .OrderByDescending(u => u.InteractionCount)
                .Take(count)
                .ToListAsync();
        }
        public async Task<List<PodcastReportDto>> GetPodcastReportsAsync(DateTime start, DateTime end)
        {
            return await _db.Podcasts
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
