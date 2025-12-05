using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using podcasty.Enums;
using podcasty.Models;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LibraryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public LibraryController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            System.Diagnostics.Debug.WriteLine($"📌 LibraryController.GetUserId: claim={claim?.Value}");
            if (int.TryParse(claim?.Value, out int userId))
                return userId;
            return 0;
        }

        /// <summary>
        /// Debug endpoint to check what's happening
        /// </summary>
        [HttpGet("debug")]
        public async Task<IActionResult> Debug()
        {
            int userId = GetUserId();
            
            var allInteractions = await _db.UserInteractions
                .Where(ui => ui.UserId == userId)
                .ToListAsync();

            var follows = allInteractions.Where(i => i.Interaction == InteractionType.Follow).ToList();
            var favorites = allInteractions.Where(i => i.Interaction == InteractionType.Favorite).ToList();

            return Ok(new
            {
                userId,
                totalInteractions = allInteractions.Count,
                followCount = follows.Count,
                favoriteCount = favorites.Count,
                follows = follows.Select(f => new { f.InteractionId, f.PodcastId, type = f.Interaction.ToString() }),
                favorites = favorites.Select(f => new { f.InteractionId, f.PodcastId, type = f.Interaction.ToString() })
            });
        }

        /// <summary>
        /// Debug endpoint without auth - tests user 1
        /// </summary>
        [AllowAnonymous]
        [HttpGet("debug/user1")]
        public async Task<IActionResult> DebugUser1()
        {
            int userId = 1; // Test with user ID 1
            
            var allInteractions = await _db.UserInteractions
                .Where(ui => ui.UserId == userId)
                .ToListAsync();

            var follows = allInteractions.Where(i => i.Interaction == InteractionType.Follow).ToList();
            var favorites = allInteractions.Where(i => i.Interaction == InteractionType.Favorite).ToList();

            var followedPodcasts = await _db.UserInteractions
                .Where(ui => ui.UserId == userId && ui.Interaction == InteractionType.Follow)
                .Join(_db.Podcasts,
                    ui => ui.PodcastId,
                    p => p.PodcastId,
                    (ui, p) => new { ui.InteractionId, p.PodcastId, p.Title })
                .ToListAsync();

            return Ok(new
            {
                userId,
                totalInteractions = allInteractions.Count,
                followCount = follows.Count,
                favoriteCount = favorites.Count,
                followedPodcastsFromJoin = followedPodcasts,
                follows = follows.Select(f => new { f.InteractionId, f.PodcastId, type = f.Interaction.ToString() }),
                favorites = favorites.Select(f => new { f.InteractionId, f.PodcastId, type = f.Interaction.ToString() })
            });
        }

        /// <summary>
        /// Get all podcasts the user is following
        /// </summary>
        [HttpGet("following")]
        public async Task<IActionResult> GetFollowing()
        {
            int userId = GetUserId();
            System.Diagnostics.Debug.WriteLine($"📌 GetFollowing: userId={userId}");
            
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var followedPodcasts = await _db.UserInteractions
                .Where(ui => ui.UserId == userId && ui.Interaction == InteractionType.Follow)
                .Join(_db.Podcasts,
                    ui => ui.PodcastId,
                    p => p.PodcastId,
                    (ui, p) => new
                    {
                        interactionId = ui.InteractionId,
                        podcastId = p.PodcastId,
                        title = p.Title,
                        description = p.Description,
                        coverImage = p.CoverImage,
                        creatorId = p.CreatorId,
                        categoryId = p.CategoryId,
                        playCount = p.PlayCount,
                        followedAt = ui.CreatedAt
                    })
                .OrderByDescending(x => x.followedAt)
                .ToListAsync();

            System.Diagnostics.Debug.WriteLine($"📊 GetFollowing result: {followedPodcasts.Count} podcasts");
            return Ok(followedPodcasts);
        }

        /// <summary>
        /// Get all podcasts the user has favorited
        /// </summary>
        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites()
        {
            int userId = GetUserId();
            System.Diagnostics.Debug.WriteLine($"📌 GetFavorites: userId={userId}");
            
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var favoritedPodcasts = await _db.UserInteractions
                .Where(ui => ui.UserId == userId && ui.Interaction == InteractionType.Favorite)
                .Join(_db.Podcasts,
                    ui => ui.PodcastId,
                    p => p.PodcastId,
                    (ui, p) => new
                    {
                        interactionId = ui.InteractionId,
                        podcastId = p.PodcastId,
                        title = p.Title,
                        description = p.Description,
                        coverImage = p.CoverImage,
                        creatorId = p.CreatorId,
                        categoryId = p.CategoryId,
                        playCount = p.PlayCount,
                        favoritedAt = ui.CreatedAt
                    })
                .OrderByDescending(x => x.favoritedAt)
                .ToListAsync();

            System.Diagnostics.Debug.WriteLine($"📊 GetFavorites result: {favoritedPodcasts.Count} podcasts");
            return Ok(favoritedPodcasts);
        }
    }
}

