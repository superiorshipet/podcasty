using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        [HttpPatch]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            
            if(string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString,out  var userId))
            {
                return Unauthorized();
            }
            

            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.UserName = dto.Name;
            }

            if(dto.ProfilePicture !=null)
            {
               user.ProfilePicture = dto.ProfilePicture;
            }
            if(dto.Bio !=null)
            {
                user.Bio = dto.Bio;
            }
            user.UpdatedAt = DateTime.UtcNow;

            if(await _userRepository.UpdateUserAsync(user))
            {
                return NoContent();
            }
            return StatusCode(500, "Failed to update user profile.");
        }
    }
}
