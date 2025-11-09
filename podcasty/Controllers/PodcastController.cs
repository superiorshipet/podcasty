using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using podcasty.Models;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PodcastsController : ControllerBase
    {
        private readonly IPodcastRepository _repo;
        public PodcastsController(IPodcastRepository repo) => _repo = repo;

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] PodcastCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var podcast = new Podcast
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                CoverImage = dto.CoverImage,
                CreatorId = userId // server sets the creator!
            };

            await _repo.AddAsync(podcast);
            return Ok(podcast); // or return Created, etc.
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var podcast = await _repo.GetByIdAsync(id);
            return podcast is not null ? Ok(podcast) : NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _repo.GetAllAsync());

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
            => Ok(await _repo.GetByCategoryAsync(categoryId));

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] PodcastUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var podcast = await _repo.GetByIdAsync(id);
            if (podcast == null) return NotFound();
            if (podcast.CreatorId.ToString() != userId)
                return Forbid("Only the creator can update this podcast.");
            var updated = new Podcast
            {
                PodcastId = id,
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Status = dto.Status,
                CoverImage = dto.CoverImage
            };
            var ok = await _repo.UpdateAsync(updated);
            return ok ? Ok("updated") : NotFound();
        }

        [Authorize]
        [HttpDelete("{podcastId}")]
        public async Task<IActionResult> Delete(int podcastId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var podcast = await _repo.GetByIdAsync(podcastId);
            if (podcast == null) return NotFound();

            // Only the creator can delete this podcast
            if (podcast.CreatorId.ToString() != userId)
                return Forbid("Only the creator can delete this podcast.");

            var ok = await _repo.DeleteAsync(podcastId);
            return ok ? Ok("deleted") : NotFound();
        }

    }
}
