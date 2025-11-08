using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using podcasty.DTOs;
using podcasty.Models;
using podcasty.Repositories;
using System.Security.Claims;

namespace podcasty.Repositories
{
    public class PlayHistoryRepo : IPlayHistoryRepository
    {
        private readonly AppDbContext _db;
        public PlayHistoryRepo(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<PlayHistoryDetailsDto>> GetPlayHistoryAsync(int userId)
        {
            return await _db.PlayHistories
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.LastPlayed)
                .Select(p => new PlayHistoryDetailsDto
                {
                    Podcast_Id = p.Episode.PodcastId,
                    Episode_Id = p.EpisodeId,
                    Episode_Title = p.Episode.Title,
                    Episode_Description = p.Episode.Description,
                    Episode_Number = p.Episode.EpisodeNumber,
                    Publised_At = p.Episode.PublishedAt,
                    Play_Count = p.Episode.PlayCount,
                    progress_seconds = p.ProgressSeconds,
                    Completed = p.Completed,
                })
                .ToListAsync();
        }

        public async Task UpdateProgressAsync(int userId, UpdateProgressDataDto playHistory)
        {
            var history = await _db.PlayHistories
                .FirstOrDefaultAsync(h => h.UserId == userId && h.EpisodeId == playHistory.EpisodeId);

            if (history == null)
            {
                history = new PlayHistory
                {
                    UserId = userId,
                    EpisodeId = playHistory.EpisodeId,
                    ProgressSeconds = playHistory.ProgressSeconds,
                    Completed = playHistory.Completed,
                    LastPlayed = playHistory.LastPlayed
                };

                await _db.PlayHistories.AddAsync(history);
            }
            else
            {
                history.ProgressSeconds = playHistory.ProgressSeconds;
                history.Completed = playHistory.Completed;
                history.LastPlayed = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
        }
    }
}
