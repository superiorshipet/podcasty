using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Enums;
using podcasty.Interfaces;
using podcasty.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace podcasty.Controllers
{
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

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            System.Diagnostics.Debug.WriteLine($"🔑 GetUserId: claim={claim?.Value}");
            if (int.TryParse(claim?.Value, out int userId))
            {
                System.Diagnostics.Debug.WriteLine($"✅ Parsed userId={userId}");
                return userId;
            }
            System.Diagnostics.Debug.WriteLine($"❌ Failed to parse");
            return 0;
        }

        [HttpPost("like")]
        public async Task<IActionResult> Like([FromBody] UserPodcastInteractionDto dto)
        {
            System.Diagnostics.Debug.WriteLine($"📥 Like endpoint called: podcastId={dto.PodcastId}");
            int userId = GetUserId();
            System.Diagnostics.Debug.WriteLine($"📌 Like: userId={userId}");
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
            if (!podcastExists)
                return BadRequest(new { error = "Podcast not found" });

            var existing = await _repo.GetExistingInteractionAsync(userId, dto.PodcastId, InteractionType.Like);
            if (existing != null)
            {
                await _repo.DeleteAsync(existing.InteractionId);
                return Ok(new { status = "removed" });
            }

            var interaction = new UserInteraction
            {
                UserId = userId,
                PodcastId = dto.PodcastId,
                Interaction = InteractionType.Like,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(interaction);
            return Ok(new { status = "added" });
        }

        [HttpPost("favorite")]
        public async Task<IActionResult> Favorite([FromBody] UserPodcastInteractionDto dto)
        {
            System.Diagnostics.Debug.WriteLine($"📥 Favorite endpoint called: podcastId={dto.PodcastId}");
            int userId = GetUserId();
            System.Diagnostics.Debug.WriteLine($"📌 Favorite: userId={userId}");
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
            if (!podcastExists)
                return BadRequest(new { error = "Podcast not found" });

            var existing = await _repo.GetExistingInteractionAsync(userId, dto.PodcastId, InteractionType.Favorite);
            if (existing != null)
            {
                await _repo.DeleteAsync(existing.InteractionId);
                return Ok(new { status = "removed" });
            }

            var interaction = new UserInteraction
            {
                UserId = userId,
                PodcastId = dto.PodcastId,
                Interaction = InteractionType.Favorite,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(interaction);
            return Ok(new { status = "added" });
        }

        [HttpPost("follow")]
        public async Task<IActionResult> Follow([FromBody] UserPodcastInteractionDto dto)
        {
            System.Diagnostics.Debug.WriteLine($"📥 Follow endpoint called: podcastId={dto.PodcastId}");
            int userId = GetUserId();
            System.Diagnostics.Debug.WriteLine($"📌 Follow: userId={userId}");
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
            if (!podcastExists)
                return BadRequest(new { error = "Podcast not found" });

            var existing = await _repo.GetExistingInteractionAsync(userId, dto.PodcastId, InteractionType.Follow);
            if (existing != null)
            {
                await _repo.DeleteAsync(existing.InteractionId);
                return Ok(new { status = "removed" });
            }

            var interaction = new UserInteraction
            {
                UserId = userId,
                PodcastId = dto.PodcastId,
                Interaction = InteractionType.Follow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(interaction);
            return Ok(new { status = "added" });
        }

        [HttpPost("dislike")]
        public async Task<IActionResult> Dislike([FromBody] UserPodcastInteractionDto dto)
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
            if (!podcastExists)
                return BadRequest(new { error = "Podcast not found" });

            // Remove Like if exists
            var existingLike = await _repo.GetExistingInteractionAsync(userId, dto.PodcastId, InteractionType.Like);
            if (existingLike != null)
                await _repo.DeleteAsync(existingLike.InteractionId);

            // Check if Dislike exists
            var existing = await _repo.GetExistingInteractionAsync(userId, dto.PodcastId, InteractionType.Dislike);
            if (existing != null)
            {
                await _repo.DeleteAsync(existing.InteractionId);
                return Ok(new { status = "removed" });
            }

            var interaction = new UserInteraction
            {
                UserId = userId,
                PodcastId = dto.PodcastId,
                Interaction = InteractionType.Dislike,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(interaction);
            return Ok(new { status = "added" });
        }

        [HttpPost("comment")]
        public async Task<IActionResult> Comment([FromBody] CommentInputDto dto)
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var podcastExists = await _db.Podcasts.AnyAsync(p => p.PodcastId == dto.PodcastId);
            if (!podcastExists)
                return BadRequest(new { error = "Podcast not found" });

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
            return Ok(new { status = "added" });
        }

        [HttpPut("comment/{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] EditCommentDto dto)
        {
            int userId = GetUserId();
            var success = await _repo.UpdateCommentContent(id, userId, dto.Content);
            if (!success)
                return Unauthorized(new { error = "Not authorized" });
            return Ok(new { status = "updated" });
        }

        [HttpDelete("comment/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            int userId = GetUserId();
            var role = User.FindFirst(ClaimTypes.Role)?.Value 
                ?? User.FindFirst("role")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var isAdmin = role?.ToLower() == "admin";
            
            var interaction = await _repo.GetInteractionByIdAsync(id);
            if (interaction == null)
                return NotFound();
            
            // Allow owner or admin to delete
            if (interaction.UserId != userId && !isAdmin)
                return Unauthorized(new { error = "Not authorized" });

            await _repo.DeleteAsync(id);
            return Ok(new { status = "deleted" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInteraction(int id)
        {
            int userId = GetUserId();
            var role = User.FindFirst(ClaimTypes.Role)?.Value 
                ?? User.FindFirst("role")?.Value 
                ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
            var isAdmin = role?.ToLower() == "admin";
            
            var interaction = await _repo.GetInteractionByIdAsync(id);
            if (interaction == null)
                return NotFound();
            
            // Allow owner or admin to delete
            if (interaction.UserId != userId && !isAdmin)
                return Unauthorized(new { error = "Not authorized" });

            await _repo.DeleteAsync(id);
            return Ok(new { status = "deleted" });
        }

        [AllowAnonymous]
        [HttpGet("bypodcast/{podcastId}")]
        public async Task<IActionResult> GetByPodcast(int podcastId)
        {
            var interactions = await _repo.GetByPodcastAsync(podcastId);
            return Ok(interactions);
        }

        [HttpGet("byuser")]
        public async Task<IActionResult> GetByUser()
        {
            int userId = GetUserId();
            System.Diagnostics.Debug.WriteLine($"📌 GetByUser called: userId={userId}");
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var interactions = await _repo.GetByUserAsync(userId);
            System.Diagnostics.Debug.WriteLine($"📊 GetByUser result: found {interactions.Count()} interactions");
            foreach (var i in interactions)
                System.Diagnostics.Debug.WriteLine($"   - ID:{i.InteractionId}, PodcastId:{i.PodcastId}, Type:{i.Interaction}");
            
            // ✅ Return a clean DTO to avoid circular reference issues with navigation properties
            var result = interactions.Select(i => new
            {
                interactionId = i.InteractionId,
                userId = i.UserId,
                podcastId = i.PodcastId,
                interaction = (int)i.Interaction, // Return as number (0=Like, 1=Favorite, 2=Follow, 3=Comment, 4=Dislike)
                commentContent = i.CommentContent,
                createdAt = i.CreatedAt,
                updatedAt = i.UpdatedAt
            });
            
            return Ok(result);
        }

        [HttpGet("debug/me")]
        public async Task<IActionResult> DebugMe()
        {
            int userId = GetUserId();
            var interactions = await _repo.GetByUserAsync(userId);
            
            return Ok(new
            {
                userId,
                isAuthenticated = userId > 0,
                claims = User.Claims.Select(c => new { c.Type, c.Value }),
                interactionCount = interactions.Count(),
                interactions = interactions.Select(i => new
                {
                    i.InteractionId,
                    i.PodcastId,
                    type = i.Interaction.ToString(),
                    typeValue = (int)i.Interaction,
                    i.CreatedAt
                })
            });
        }

        [AllowAnonymous]
        [HttpGet("debug/all")]
        public async Task<IActionResult> DebugAll()
        {
            System.Diagnostics.Debug.WriteLine($"🔍 DebugAll: Fetching all interactions from database");
            var allInteractions = await _db.UserInteractions.ToListAsync();
            System.Diagnostics.Debug.WriteLine($"📊 DebugAll: Found {allInteractions.Count} total interactions in database");
            
            foreach (var interaction in allInteractions)
            {
                System.Diagnostics.Debug.WriteLine($"   - UserId:{interaction.UserId}, PodcastId:{interaction.PodcastId}, Type:{interaction.Interaction}");
            }
            
            return Ok(new
            {
                totalInteractionsInDb = allInteractions.Count,
                allInteractions = allInteractions.Select(i => new
                {
                    i.InteractionId,
                    i.UserId,
                    i.PodcastId,
                    type = i.Interaction.ToString(),
                    typeValue = (int)i.Interaction,
                    i.CreatedAt
                })
            });
        }
    }
}
