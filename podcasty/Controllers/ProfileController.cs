using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using System.Security.Claims;
using System.Linq; 

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

        [HttpPatch]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            Console.WriteLine("🔍 --- START PROFILE DEBUG ---");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"👉 Claim found: Type='{claim.Type}', Value='{claim.Value}'");
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                               ?? User.FindFirstValue("nameid")               
                               ?? User.FindFirstValue("sub")                  
                               ?? User.FindFirstValue("Id")                  
                               ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier"))?.Value; // بحث بالنهاية

            Console.WriteLine($"🎯 Extracted ID String: '{userIdString}'");

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                Console.WriteLine("❌ ERROR: Could not parse User ID from token.");
                Console.WriteLine("--- END DEBUG ---");

                return Unauthorized(new { message = "Token is valid but User ID is missing. Check server logs." });
            }

            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                Console.WriteLine($"❌ ERROR: User ID {userId} not found in Database.");
                return NotFound(new { message = "User not found." });
            }

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
                    Console.WriteLine("✅ SUCCESS: User updated.");
                    return Ok(new { message = "Profile updated successfully" });
                }
            }

            Console.WriteLine("⚠️ No changes applied or Update failed.");
            return Ok(new { message = "No changes applied" });
        }
    }
}