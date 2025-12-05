using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using System.Security.Claims;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public ProfileController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET /api/Profile - Get current user's full profile from database
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
                               ?? User.FindFirstValue("nameid")
                               ?? User.FindFirstValue("sub")
                               ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"))?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token." });
            }

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound(new { message = "User not found." });

            return Ok(new {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                role = user.Role.ToString(),
                profilePicture = user.ProfilePicture,
                bio = user.Bio
            });
        }

        // PATCH /api/Profile - Update current user's profile
        [HttpPatch]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
                               ?? User.FindFirstValue("nameid")
                               ?? User.FindFirstValue("sub")
                               ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"))?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token." });
            }

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound(new { message = "User not found." });

            bool hasChanges = false;

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.UserName = dto.Name;
                user.NormalizedUserName = dto.Name.ToUpper();
                hasChanges = true;
            }

            if (dto.ProfilePicture != null)
            {
                user.ProfilePicture = dto.ProfilePicture;
                hasChanges = true;
            }

            if (dto.Bio != null)
            {
                user.Bio = dto.Bio;
                hasChanges = true;
            }

            if (hasChanges)
            {
                user.UpdatedAt = DateTime.UtcNow;
                var result = await _userRepository.UpdateUserAsync(user);

                if (result)
                {
                    return Ok(new { message = "Profile updated successfully" });
                }
            }

            return Ok(new { message = "No changes applied" });
        }
    }
}