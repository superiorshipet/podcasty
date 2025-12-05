using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using podcasty.Models;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PodcastsController : ControllerBase
    {
        private readonly IPodcastRepository _repo;
        private readonly ICategoryRepository _categoryRepo;

        public PodcastsController(IPodcastRepository repo, ICategoryRepository categoryRepo)
        {
            _repo = repo;
            _categoryRepo = categoryRepo;
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> Create([FromBody] PodcastCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Forbid("User ID claim not found or invalid.");
            }

            var categoryExists = await _categoryRepo.ExistsAsync(dto.CategoryId);
            if (!categoryExists)
                return BadRequest("Invalid CategoryId: The category does not exist.");

            var podcast = new Podcast
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                CoverImage = dto.CoverImage,
                CreatorId = userId 
            };

            await _repo.AddAsync(podcast);
            return Ok(podcast);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var podcast = await _repo.GetByIdAsync(id);
            if (podcast == null) return NotFound();

            // Return flat object WITHOUT AudioFile for faster loading
            var result = new {
                podcast.PodcastId,
                podcast.CreatorId,
                podcast.CategoryId,
                podcast.Title,
                podcast.Description,
                podcast.CoverImage,
                podcast.Status,
                podcast.PlayCount,
                podcast.CreatedAt,
                podcast.UpdatedAt,
                podcast.IsApproved,
                Creator = podcast.Creator != null ? new {
                    Id = podcast.Creator.Id,
                    UserName = podcast.Creator.UserName
                } : null,
                Episodes = podcast.Episodes?.Select(e => new {
                    e.EpisodeId,
                    e.PodcastId,
                    e.Title,
                    e.Description,
                    // AudioFile excluded for performance - load via /Episodes/{id}/audio
                    e.CoverImage,
                    e.Duration,
                    e.EpisodeNumber,
                    e.PlayCount,
                    e.PublishedAt,
                    e.IsApproved,
                    HasAudio = !string.IsNullOrEmpty(e.AudioFile)
                })
            };

            return Ok(result);
        }

        [HttpGet("{id}/stats")]
        public async Task<IActionResult> GetStats(int id)
        {
            var stats = await _repo.GetPodcastStatsAsync(id);
            return Ok(stats);
        }

        // Optimized: Return only essential fields for listing
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var podcasts = await _repo.GetAllAsync();
            
            // Return lightweight response with creator info
            var result = podcasts.Select(p => new {
                p.PodcastId,
                p.CreatorId,
                p.CategoryId,
                p.Title,
                p.Description,
                p.CoverImage,
                p.Status,
                p.PlayCount,
                p.CreatedAt,
                p.UpdatedAt,
                p.IsApproved,
                Creator = p.Creator != null ? new {
                    p.Creator.Id,
                    p.Creator.UserName
                } : null
            });
            
            return Ok(result);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var podcasts = await _repo.GetByCategoryAsync(categoryId);
            
            var result = podcasts.Select(p => new {
                p.PodcastId,
                p.CreatorId,
                p.CategoryId,
                p.Title,
                p.Description,
                p.CoverImage,
                p.Status,
                p.PlayCount,
                p.CreatedAt,
                p.UpdatedAt,
                p.IsApproved,
                Creator = p.Creator != null ? new {
                    p.Creator.Id,
                    p.Creator.UserName
                } : null
            });
            
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize] 
        public async Task<IActionResult> Update(int id, [FromBody] PodcastUpdateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value 
                ?? User.FindFirst("role")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var isAdmin = role?.ToLower() == "admin";
            
            var podcast = await _repo.GetByIdAsync(id);
            if (podcast == null) return NotFound();

            // Allow creator or admin to update
            if (podcast.CreatorId.ToString() != userId && !isAdmin)
                return Forbid("Only the creator or admin can update this podcast.");

            podcast.Title = dto.Title ?? podcast.Title;
            podcast.Description = dto.Description ?? podcast.Description;
            podcast.CategoryId = dto.CategoryId ?? podcast.CategoryId;
            podcast.Status = dto.Status ?? podcast.Status;
            podcast.CoverImage = dto.CoverImage ?? podcast.CoverImage;
            
            var ok = await _repo.UpdateAsync(podcast);
            return ok ? Ok("updated") : NotFound();
        }

        [Authorize] 
        [HttpDelete("{podcastId}")]
        public async Task<IActionResult> Delete(int podcastId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value 
                ?? User.FindFirst("role")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var isAdmin = role?.ToLower() == "admin";
            
            var podcast = await _repo.GetByIdAsync(podcastId);
            if (podcast == null) return NotFound();

            // Allow creator or admin to delete
            if (podcast.CreatorId.ToString() != userId && !isAdmin)
                return Forbid("Only the creator or admin can delete this podcast.");

            var ok = await _repo.DeleteAsync(podcastId);
            return ok ? Ok("deleted") : NotFound();
        }
    }
}