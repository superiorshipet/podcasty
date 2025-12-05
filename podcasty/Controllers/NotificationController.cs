using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _repo;

        public NotificationController(INotificationRepository repo)
        {
            _repo = repo;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (int.TryParse(claim?.Value, out int userId))
                return userId;
            return 0;
        }

        /// <summary>
        /// Get all notifications for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var notifications = await _repo.GetByUserAsync(userId);
            var result = notifications.Select(n => new
            {
                notificationId = n.NotificationId,
                podcastId = n.PodcastId,
                episodeId = n.EpisodeId,
                title = n.Title,
                message = n.Message,
                isRead = n.IsRead,
                createdAt = n.CreatedAt
            });

            return Ok(result);
        }

        /// <summary>
        /// Get unread notification count
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var count = await _repo.GetUnreadCountAsync(userId);
            return Ok(new { count });
        }

        /// <summary>
        /// Mark a notification as read
        /// </summary>
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var notification = await _repo.GetByIdAsync(id);
            if (notification == null)
                return NotFound();
            if (notification.UserId != userId)
                return Forbid();

            await _repo.MarkAsReadAsync(id);
            return Ok(new { status = "marked as read" });
        }

        /// <summary>
        /// Mark all notifications as read
        /// </summary>
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            await _repo.MarkAllAsReadAsync(userId);
            return Ok(new { status = "all marked as read" });
        }

        /// <summary>
        /// Delete a notification
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = GetUserId();
            if (userId == 0)
                return Unauthorized(new { error = "Not authenticated" });

            var notification = await _repo.GetByIdAsync(id);
            if (notification == null)
                return NotFound();
            if (notification.UserId != userId)
                return Forbid();

            await _repo.DeleteAsync(id);
            return Ok(new { status = "deleted" });
        }
    }
}
