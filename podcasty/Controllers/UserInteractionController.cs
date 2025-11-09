using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UserInteractionController : ControllerBase
{
    private readonly IUserInteractionRepository _repo;
    private readonly AppDbContext _db;

    public UserInteractionController(IUserInteractionRepository repo,AppDbContext db)
    {
        _repo = repo;
        _db = db;

    }

    [HttpPost("like")]
    public async Task<IActionResult> Like([FromBody] UserPodcastInteractionDto dto)
    {
        var userExists = await _db.Users.AnyAsync(u => u.Id == dto.UserId);
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!userExists || !podcastExists) return BadRequest("User or podcast does not exist.");

        var interaction = new UserInteraction
        {
            UserId = dto.UserId,
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
        var userExists = await _db.Users.AnyAsync(u => u.Id == dto.UserId);
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!userExists || !podcastExists) return BadRequest("User or podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = dto.UserId,
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
        var userExists = await _db.Users.AnyAsync(u => u.Id == dto.UserId);
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!userExists || !podcastExists) return BadRequest("User or podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = dto.UserId,
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
        var userExists = await _db.Users.AnyAsync(u => u.Id == dto.UserId);
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!userExists || !podcastExists) return BadRequest("User or podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = dto.UserId,
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
        var userExists = await _db.Users.AnyAsync(u => u.Id == dto.UserId);
        var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
        if (!userExists || !podcastExists) return BadRequest("User or podcast does not exist.");
        var interaction = new UserInteraction
        {
            UserId = dto.UserId,
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
        var success = await _repo.UpdateCommentContent(id, dto.UserId, dto.Content);
        if (!success) return Forbid("Not authorized or comment not found");
        return Ok("Comment updated");
    }


    // Fetch all for a podcast or user (optional)
    [HttpGet("bypodcast/{podcastId}")]
    public async Task<IActionResult> GetByPodcast(int podcastId) =>
        Ok(await _repo.GetByPodcastAsync(podcastId));

    [HttpGet("byuser/{userId}")]
    public async Task<IActionResult> GetByUser(int userId) =>
        Ok(await _repo.GetByUserAsync(userId));
}
