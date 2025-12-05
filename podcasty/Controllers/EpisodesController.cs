using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using podcasty.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EpisodesController : ControllerBase
    {
        private readonly IEpisodeRepository _repo;
        private readonly IPodcastRepository _podcastRepo;
        private readonly INotificationRepository _notificationRepo;
        private readonly AppDbContext _db;

        public EpisodesController(IEpisodeRepository repo, IPodcastRepository podcastRepo, INotificationRepository notificationRepo, AppDbContext db)
        {
            _repo = repo;
            _podcastRepo = podcastRepo;
            _notificationRepo = notificationRepo;
            _db = db;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] EpisodeCreateDto dto)
        {
            Console.WriteLine($"Create Episode: PodcastId={dto.PodcastId}, Title={dto.Title}");
            
            var episode = new Episode
            {
                PodcastId = dto.PodcastId,
                Title = dto.Title,
                Description = dto.Description,
                AudioFile = dto.AudioFile,
                CoverImage = dto.CoverImage,
                Duration = dto.Duration ?? 0,
                EpisodeNumber = dto.EpisodeNumber ?? 1,
                PublishedAt = dto.PublishedAt ?? DateTime.UtcNow,
                PlayCount = 0,
                IsApproved = true
            };
            var created = await _repo.AddAsync(episode);
            
            Console.WriteLine($"Episode created: ID={created.EpisodeId}");

            // Create notifications for all followers of this podcast
            var podcast = await _podcastRepo.GetByIdAsync(dto.PodcastId);
            if (podcast != null)
            {
                await _notificationRepo.CreateNotificationsForFollowersAsync(
                    dto.PodcastId,
                    created.EpisodeId,
                    podcast.Title,
                    dto.Title
                );
            }

            return Ok(created);
        }

        [HttpGet("debug/all")]
        [AllowAnonymous]
        public async Task<IActionResult> DebugGetAll()
        {
            var episodes = await _repo.GetAllAsync();
            return Ok(new { 
                totalEpisodes = episodes.Count, 
                episodes = episodes.Select(e => new { e.EpisodeId, e.PodcastId, e.Title, e.IsApproved, e.PublishedAt })
            });
        }

        // Get single episode with full audio (for playback)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var episode = await _repo.GetByIdAsync(id);
            return episode is not null ? Ok(episode) : NotFound();
        }

        // Get episodes by podcast - lightweight response for listing
        [HttpGet("podcast/{podcastId}")]
        public async Task<IActionResult> GetByPodcast(int podcastId)
        {
            var episodes = await _repo.GetByPodcastAsync(podcastId);
            
            // Return lightweight list without audio data
            var result = episodes.Select(e => new {
                e.EpisodeId,
                e.PodcastId,
                e.Title,
                e.Description,
                e.CoverImage,
                e.Duration,
                e.EpisodeNumber,
                e.PlayCount,
                e.PublishedAt,
                e.IsApproved,
                // Don't include AudioFile in listing - it's too large!
                HasAudio = !string.IsNullOrEmpty(e.AudioFile)
            });
            
            return Ok(result);
        }

        // Get episode audio only (for playback)
        [HttpGet("{id}/audio")]
        public async Task<IActionResult> GetAudio(int id)
        {
            var episode = await _repo.GetByIdAsync(id);
            if (episode == null) return NotFound();
            
            return Ok(new { audioFile = episode.AudioFile });
        }

        // Record a play for an episode (increment playCount)
        [HttpPost("{id}/play")]
        [Authorize]
        public async Task<IActionResult> RecordPlay(int id)
        {
            var episode = await _repo.GetByIdAsync(id);
            if (episode == null) return NotFound();
            
            episode.PlayCount += 1;
            var updated = await _repo.UpdateAsync(episode);
            
            if (updated)
            {
                // Also update podcast's total play count
                var podcast = await _podcastRepo.GetByIdAsync(episode.PodcastId);
                if (podcast != null)
                {
                    podcast.PlayCount += 1;
                    await _podcastRepo.UpdateAsync(podcast);
                }
                
                Console.WriteLine($"Play recorded for episode {id}. New count: {episode.PlayCount}");
                return Ok(new { playCount = episode.PlayCount });
            }
            
            return BadRequest("Failed to record play");
        }

        [HttpPut("{episodeId}")]
        [Authorize]
        public async Task<IActionResult> Update(int episodeId, [FromBody] EpisodeUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value 
                ?? User.FindFirst("role")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var isAdmin = role?.ToLower() == "admin";

            var episode = await _repo.GetByIdAsync(episodeId);
            if (episode == null) return NotFound();

            var podcast = await _podcastRepo.GetByIdAsync(episode.PodcastId);
            if (podcast == null) return NotFound();

            // Allow creator or admin to update
            if (podcast.CreatorId.ToString() != userId && !isAdmin)
                return Forbid("Only the creator or admin can edit episodes for this podcast.");

            // Partial update: only update fields that are provided
            episode.Title = dto.Title ?? episode.Title;
            episode.Description = dto.Description ?? episode.Description;
            episode.AudioFile = dto.AudioFile ?? episode.AudioFile;
            episode.Duration = dto.Duration ?? episode.Duration;
            episode.EpisodeNumber = dto.EpisodeNumber ?? episode.EpisodeNumber;
            episode.PublishedAt = dto.PublishedAt ?? episode.PublishedAt;
            episode.PlayCount = dto.PlayCount ?? episode.PlayCount;

            var ok = await _repo.UpdateAsync(episode);
            return ok ? Ok("updated") : NotFound();
        }

        [HttpDelete("{id}")]
        [Authorize] 
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value 
                ?? User.FindFirst("role")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var isAdmin = role?.ToLower() == "admin";

            // Use lightweight query - only fetch what we need for authorization
            var episodeInfo = await _db.Episodes
                .AsNoTracking()
                .Where(e => e.EpisodeId == id)
                .Select(e => new { e.EpisodeId, e.PodcastId })
                .FirstOrDefaultAsync();
                
            if (episodeInfo == null) return NotFound();

            var podcastCreatorId = await _db.Podcasts
                .AsNoTracking()
                .Where(p => p.PodcastId == episodeInfo.PodcastId)
                .Select(p => p.CreatorId)
                .FirstOrDefaultAsync();

            // Allow creator or admin to delete
            if (podcastCreatorId.ToString() != userId && !isAdmin)
                return Forbid("Only the creator or admin can delete episodes.");

            var ok = await _repo.DeleteAsync(id);
            return ok ? Ok(new { status = "deleted" }) : NotFound();
        }
    }
}