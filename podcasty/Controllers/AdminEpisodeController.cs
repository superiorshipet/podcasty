using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using podcasty.Dtos;
using System.Security.Claims;

namespace podcasty.Controllers;

[ApiController]
[Route("api/admin/episodes")]
[Authorize]
public class AdminEpisodeController : ControllerBase
{
    private readonly IEpisodeRepository _repo;
    public AdminEpisodeController(IEpisodeRepository repo)
    {
        _repo = repo;
    }

    private bool IsAdmin()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value
            ?? User.FindFirst("role")?.Value
            ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
        return role != null && role.ToLower() == "admin";
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string title = null)
    {
        if (!IsAdmin()) return Forbid();
        
        var episodes = await _repo.GetAllAsync();
        
        if (!string.IsNullOrEmpty(title))
            episodes = episodes.Where(e => e.Title.Contains(title)).ToList();
        
        // Return lightweight list without audio data
        var result = episodes.Select(e => new {
            e.EpisodeId,
            e.PodcastId,
            e.Title,
            e.Description,
            e.Duration,
            e.EpisodeNumber,
            e.PlayCount,
            e.PublishedAt,
            e.IsApproved
        });
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (!IsAdmin()) return Forbid();
        var episode = await _repo.GetByIdAsync(id);
        return episode != null ? Ok(episode) : NotFound();
    }

    [HttpPut("{id}")]
    public IActionResult Edit(int id, [FromBody] EpisodeUpdateDto dto)
    {
        if (!IsAdmin()) return Forbid();
        var ok = _repo.AdminEdit(id, dto);
        return ok ? Ok("Episode updated.") : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!IsAdmin()) return Forbid();
        var ok = await _repo.DeleteAsync(id);
        return ok ? Ok("Episode deleted.") : NotFound();
    }

    [HttpPost("{id}/approve")]
    public IActionResult Approve(int id, [FromBody] bool approved)
    {
        if (!IsAdmin()) return Forbid();
        var ok = _repo.setApprovalStatus(id, approved);
        return ok ? Ok("Approval status updated.") : NotFound();
    }
}
