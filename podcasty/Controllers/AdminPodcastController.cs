using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;

namespace podcasty.Controllers
{
         [ApiController]
        [Route("api/admin/podcasts")]
        [Authorize(Roles = "Admin")]
        public class AdminPodcastController : ControllerBase
        {
            private readonly IPodcastRepository _repo;
            public AdminPodcastController(IPodcastRepository repo) { _repo = repo; }

            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                var podcasts = await _repo.GetAllAsync();
                return Ok(podcasts);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> GetById(int id)
            {
                var podcast = await _repo.GetByIdAsync(id);
                return podcast != null ? Ok(podcast) : NotFound();
            }

            [HttpPut("{id}")]
            public IActionResult Edit(int id, [FromBody] PodcastUpdateDto dto)
            {
                var ok = _repo.AdminEdit(id, dto);
                return ok ? Ok("Podcast updated.") : NotFound();
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var ok = await _repo.DeleteAsync(id);
                return ok ? Ok("Podcast deleted.") : NotFound();
            }

            [HttpPost("{id}/approve")]
            public IActionResult Approve(int id, [FromBody] bool approved)
            {
                var ok = _repo.SetApprovalStatus(id, approved);
                return ok ? Ok("Approval status updated.") : NotFound();
            }
        }
}
