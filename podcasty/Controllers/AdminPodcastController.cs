using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/admin/podcasts")]
    [Authorize]
    public class AdminPodcastController : ControllerBase
    {
        private readonly IPodcastRepository _repo;
        public AdminPodcastController(IPodcastRepository repo) { _repo = repo; }

        private bool IsAdmin()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value
                ?? User.FindFirst("role")?.Value
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            return role != null && role.ToLower() == "admin";
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!IsAdmin()) return Forbid();
            
            var podcasts = await _repo.GetAllForAdminAsync();
            
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!IsAdmin()) return Forbid();
            
            var podcast = await _repo.GetByIdAsync(id);
            if (podcast == null) return NotFound();
            
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
                    podcast.Creator.Id,
                    podcast.Creator.UserName
                } : null
            };
            
            return Ok(result);
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] PodcastUpdateDto dto)
        {
            if (!IsAdmin()) return Forbid();
            var ok = _repo.AdminEdit(id, dto);
            return ok ? Ok("Podcast updated.") : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!IsAdmin()) return Forbid();
            var ok = await _repo.DeleteAsync(id);
            return ok ? Ok("Podcast deleted.") : NotFound();
        }

        [HttpPost("{id}/approve")]
        public IActionResult Approve(int id, [FromBody] bool approved)
        {
            if (!IsAdmin()) return Forbid();
            var ok = _repo.SetApprovalStatus(id, approved);
            return ok ? Ok("Approval status updated.") : NotFound();
        }
    }
}
