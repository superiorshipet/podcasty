using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using podcasty.Models;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EpisodesController : ControllerBase
    {
        private readonly IEpisodeRepository _repo;
        private readonly IPodcastRepository _podcastRepo;
        public EpisodesController(IEpisodeRepository repo, IPodcastRepository podcastRepo)
        {
            _repo = repo;
            _podcastRepo = podcastRepo;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EpisodeCreateDto dto)
        {
            var episode = new Episode
            {
                PodcastId = dto.PodcastId,
                Title = dto.Title,
                Description = dto.Description,
                AudioFile = dto.AudioFile,
                Duration = dto.Duration,
                EpisodeNumber = dto.EpisodeNumber,
                PublishedAt = dto.PublishedAt ?? DateTime.UtcNow,
                PlayCount = 0
            };
            var created = await _repo.AddAsync(episode);
            return Ok(created);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var episode = await _repo.GetByIdAsync(id);
            return episode is not null ? Ok(episode) : NotFound();
        }

        [HttpGet("podcast/{podcastId}")]
        public async Task<IActionResult> GetByPodcast(int podcastId)
            => Ok(await _repo.GetByPodcastAsync(podcastId));

        [HttpPut("{episodeId}")]
        public async Task<IActionResult> Update(int episodeId, [FromBody] EpisodeUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var episode = await _repo.GetByIdAsync(episodeId);
            if (episode == null) return NotFound();

            var podcast = await _podcastRepo.GetByIdAsync(episode.PodcastId);
            if (podcast == null) return NotFound();

            if (podcast.CreatorId.ToString() != userId)
                return Forbid("Only the creator can edit episodes for this podcast.");

            episode.Title = dto.Title;
            episode.Description = dto.Description;
            episode.AudioFile = dto.AudioFile;
            episode.Duration = dto.Duration;
            episode.EpisodeNumber = dto.EpisodeNumber;
            episode.PublishedAt = dto.PublishedAt;
            episode.PlayCount = dto.PlayCount;

            var ok = await _repo.UpdateAsync(episode);
            return ok ? Ok("updated") : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
            => await _repo.DeleteAsync(id) ? Ok("deleted") : NotFound();
    }
}
