using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using podcasty.Dtos;
using podcasty.Interfaces;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlayHistoryController : ControllerBase
    {
        private readonly IPlayHistoryRepository _repo;
        private readonly IEpisodeRepository _episodeRepo; // Optional: for episode details

        public PlayHistoryController(IPlayHistoryRepository repo, IEpisodeRepository episodeRepo)
        {
            _repo = repo;
            _episodeRepo = episodeRepo;
        }

        // Add new play history
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] PlayHistoryCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Request body required.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var hist = await _repo.AddAsync(userId, dto);
            var episode = await _episodeRepo.GetByIdAsync(hist.EpisodeId);

            return Ok(new PlayHistoryDto
            {
                HistoryId = hist.HistoryId,
                EpisodeId = hist.EpisodeId,
                ProgressSeconds = hist.ProgressSeconds,
                Completed = hist.Completed,
                LastPlayed = hist.LastPlayed,
                EpisodeTitle = episode?.Title // Show title if available
            });
        }

        // Update existing play history
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PlayHistoryCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Request body required.");

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var hist = await _repo.UpdateAsync(userId, id, dto);
            if (hist == null) return NotFound("Not found or not owned by user.");

            var episode = await _episodeRepo.GetByIdAsync(hist.EpisodeId);

            return Ok(new PlayHistoryDto
            {
                HistoryId = hist.HistoryId,
                EpisodeId = hist.EpisodeId,
                ProgressSeconds = hist.ProgressSeconds,
                Completed = hist.Completed,
                LastPlayed = hist.LastPlayed,
                EpisodeTitle = episode?.Title
            });
        }

        // Delete a play history record
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _repo.DeleteAsync(userId, id);

            if (!result) return NotFound("Record not found or not yours.");
            return Ok("Deleted.");
        }

        // Get all play history for this user
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var history = await _repo.GetByUserAsync(userId);

            return Ok(history.Select(hist => new PlayHistoryDto
            {
                HistoryId = hist.HistoryId,
                EpisodeId = hist.EpisodeId,
                ProgressSeconds = hist.ProgressSeconds,
                Completed = hist.Completed,
                LastPlayed = hist.LastPlayed,
                EpisodeTitle = hist.Episode?.Title 
            }));
        }
    }
}
