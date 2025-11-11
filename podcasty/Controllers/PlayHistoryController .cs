using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayHistoryController : ControllerBase
    {
        private readonly IPlayHistoryRepository _repo;
        public PlayHistoryController(IPlayHistoryRepository repo) { _repo = repo; }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] PlayHistoryCreateDto dto)
        {
            int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var hist = await _repo.AddAsync(userId, dto);
            return Ok(new PlayHistoryDto
            {
                HistoryId = hist.HistoryId,
                EpisodeId = hist.EpisodeId,
                ProgressSeconds = hist.ProgressSeconds,
                Completed = hist.Completed,
                LastPlayed = hist.LastPlayed
            });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] PlayHistoryCreateDto dto)
        {
            int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var hist = await _repo.UpdateAsync(userId, id, dto);
            if (hist == null) return NotFound();
            return Ok(new PlayHistoryDto
            {
                HistoryId = hist.HistoryId,
                EpisodeId = hist.EpisodeId,
                ProgressSeconds = hist.ProgressSeconds,
                Completed = hist.Completed,
                LastPlayed = hist.LastPlayed
            });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var result = await _repo.DeleteAsync(userId, id);
            if (!result) return NotFound();
            return Ok("Deleted.");
        }

        [HttpGet("mine")]
        [Authorize]
        public async Task<IActionResult> GetMine()
        {
            int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var history = await _repo.GetByUserAsync(userId);
            return Ok(history.Select(hist => new PlayHistoryDto
            {
                HistoryId = hist.HistoryId,
                EpisodeId = hist.EpisodeId,
                ProgressSeconds = hist.ProgressSeconds,
                Completed = hist.Completed,
                LastPlayed = hist.LastPlayed
            }));
        }
    }
}
