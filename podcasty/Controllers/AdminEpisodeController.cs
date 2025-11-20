using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using podcasty.Dtos;
namespace podcasty.Controllers;
[ApiController]
[Route("api/admin/episodes")]
[Authorize(Roles = "Admin")]
public class AdminEpisodeController : ControllerBase
{
    private readonly IEpisodeRepository _repo;
    public AdminEpisodeController(IEpisodeRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string title = null)
    {
        var episodes = await _repo.GetAllAsync();
        if (!string.IsNullOrEmpty(title))
            episodes = (List<Models.Episode>)episodes.Where(e => e.Title.Contains(title));
        return Ok(episodes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var episode = await _repo.GetByIdAsync(id);
        return episode != null ? Ok(episode) : NotFound();
    }

    [HttpPut("{id}")]
    public IActionResult Edit(int id, [FromBody] EpisodeUpdateDto dto)
    {
        var ok = _repo.AdminEdit(id, dto);
        return ok ? Ok("Episode updated.") : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? Ok("Episode deleted.") : NotFound();
    }
        [HttpPost("{id}/approve")]
    public IActionResult Approve(int id, [FromBody] bool approved)
    {
        var ok = _repo.setApprovalStatus(id, approved);
        return ok ? Ok("Approval status updated.") : NotFound();
    }
}
