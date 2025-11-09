using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserInteractionController : ControllerBase
{
    private readonly IUserInteractionRepository _repo;
    private readonly AppDbContext _db;

    public UserInteractionController(IUserInteractionRepository repo, AppDbContext db)
    {
        _repo = repo;
        _db = db;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

    [HttpPost("like")]
    public async Task<IActionResult> Like([FromBody] UserPodcastInteractionDto dto)
    {
        int userId = GetUserId();
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!podcastExists) return BadRequest("Podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = userId,
            PodcastId = dto.PodcastId,
            Interaction = InteractionType.Like,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(interaction);
        return Ok();
    }

    [HttpPost("dislike")]
    public async Task<IActionResult> Dislike([FromBody] UserPodcastInteractionDto dto)
    {
        int userId = GetUserId();
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!podcastExists) return BadRequest("Podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = userId,
            PodcastId = dto.PodcastId,
            Interaction = InteractionType.Dislike,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(interaction);
        return Ok();
    }

    [HttpPost("favorite")]
    public async Task<IActionResult> Favorite([FromBody] UserPodcastInteractionDto dto)
    {
        int userId = GetUserId();
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!podcastExists) return BadRequest("Podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = userId,
            PodcastId = dto.PodcastId,
            Interaction = InteractionType.Favorite,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(interaction);
        return Ok();
    }

    [HttpPost("follow")]
    public async Task<IActionResult> Follow([FromBody] UserPodcastInteractionDto dto)
    {
        int userId = GetUserId();
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!podcastExists) return BadRequest("Podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = userId,
            PodcastId = dto.PodcastId,
            Interaction = InteractionType.Follow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(interaction);
        return Ok();
    }

    [HttpPost("comment")]
    public async Task<IActionResult> Comment([FromBody] CommentInputDto dto)
    {
        int userId = GetUserId();
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!podcastExists) return BadRequest("Podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = userId,
            PodcastId = dto.PodcastId,
            Interaction = InteractionType.Comment,
            CommentContent = dto.Content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(interaction);
        return Ok();
    }

    [HttpPut("comment/{id}")]
    public async Task<IActionResult> UpdateComment(int id, [FromBody] EditCommentDto dto)
    {
        int userId = GetUserId();
        var success = await _repo.UpdateCommentContent(id, userId, dto.Content);
        if (!success) return NotFound("Not authorized or comment not found");
        return Ok("Comment updated");
    }

    [HttpDelete("comment/{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        int userId = GetUserId();
        var interaction = await _repo.GetInteractionByIdAsync(id);
        if (interaction == null) return NotFound();
        if (interaction.UserId != userId)
            return NotFound("Not authorized to delete this comment.");
        var ok = await _repo.DeleteAsync(id);
        return ok ? Ok("deleted") : NotFound();
    }

    [HttpGet("bypodcast/{podcastId}")]
    public async Task<IActionResult> GetByPodcast(int podcastId) =>
        Ok(await _repo.GetByPodcastAsync(podcastId));

    [HttpGet("byuser")]
    public async Task<IActionResult> GetByUser()
    {
        int userId = GetUserId();
        return Ok(await _repo.GetByUserAsync(userId));
    }
}
