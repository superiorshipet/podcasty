using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;

[ApiController]
[Route("api/admin/comments")]
[Authorize(Roles = "Admin")]
public class AdminCommentController : ControllerBase
{
    private readonly IUserInteractionRepository _repo;
    public AdminCommentController(IUserInteractionRepository repo) { _repo = repo; }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? userId = null, [FromQuery] int? podcastId = null)
    {
        List<UserInteraction> comments = new List<UserInteraction>();
        if (userId.HasValue)
            comments = (await _repo.GetByUserAsync(userId.Value))
                .Where(ui => ui.Interaction == InteractionType.Comment).ToList();
        else if (podcastId.HasValue)
            comments = (await _repo.GetByPodcastAsync(podcastId.Value))
                .Where(ui => ui.Interaction == InteractionType.Comment).ToList();
        return Ok(comments);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? Ok("Comment deleted.") : NotFound();
    }
}
