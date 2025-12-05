using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using podcasty.Models;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlayHistoryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PlayHistoryController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/PlayHistory/mine - Get current user's listening history
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
                               ?? User.FindFirstValue("nameid")
                               ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"))?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token." });
            }

            var history = await _db.PlayHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.LastPlayed)
                .Select(h => new {
                    historyId = h.HistoryId,
                    episodeId = h.EpisodeId,
                    episodeTitle = h.Episode.Title,
                    podcastTitle = h.Episode.Podcast.Title,
                    podcastCover = h.Episode.Podcast.CoverImage,
                    progressSeconds = h.ProgressSeconds,
                    completed = h.Completed,
                    lastPlayed = h.LastPlayed
                })
                .ToListAsync();

            return Ok(history);
        }

        // POST /api/PlayHistory - Add or update play history
        [HttpPost]
        public async Task<IActionResult> AddOrUpdate([FromBody] PlayHistoryDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
                               ?? User.FindFirstValue("nameid")
                               ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"))?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token." });
            }

            // Check if episode exists
            var episode = await _db.Episodes.FindAsync(dto.EpisodeId);
            if (episode == null)
            {
                return NotFound(new { message = "Episode not found." });
            }

            // Find existing history or create new
            var existing = await _db.PlayHistories
                .FirstOrDefaultAsync(h => h.UserId == userId && h.EpisodeId == dto.EpisodeId);

            if (existing != null)
            {
                existing.ProgressSeconds = dto.ProgressSeconds;
                existing.Completed = dto.Completed;
                existing.LastPlayed = DateTime.UtcNow;
            }
            else
            {
                var newHistory = new PlayHistory
                {
                    UserId = userId,
                    EpisodeId = dto.EpisodeId,
                    ProgressSeconds = dto.ProgressSeconds,
                    Completed = dto.Completed,
                    LastPlayed = DateTime.UtcNow
                };
                _db.PlayHistories.Add(newHistory);
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Play history updated." });
        }
    }

    public class PlayHistoryDto
    {
        public int EpisodeId { get; set; }
        public int ProgressSeconds { get; set; }
        public bool Completed { get; set; }
    }
}
