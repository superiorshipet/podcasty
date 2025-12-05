using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using podcasty.Models;
using System.Security.Claims;

namespace podcasty.Controllers
{
        [ApiController]
        [Route("api/admin/users")]
        [Authorize]
    public class AdminUserController : ControllerBase
        {
            private readonly IUserRepository _repo;

            public AdminUserController(IUserRepository repo)
            {
                _repo = repo;
            }

            private bool IsAdmin()
            {
                var role = User.FindFirst(ClaimTypes.Role)?.Value
                    ?? User.FindFirst("role")?.Value
                    ?? User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
                
                return role != null && role.ToLower() == "admin";
            }

            // 1. List all users 
            [HttpGet]
            public IActionResult GetUsers([FromQuery] string email = null, [FromQuery] string name = null)
            {
                if (!IsAdmin()) return Forbid();
                
                IEnumerable<User> users = _repo.GetAll();

                if (!string.IsNullOrEmpty(email))
                    users = users.Where(u => u.Email == email);

                if (!string.IsNullOrEmpty(name))
                    users = users.Where(u => u.UserName == name);

                return Ok(users);
            }
            // 2. Promote/Demote user role
            [HttpPut("{id}/role")]
            public IActionResult ChangeRole(int id, [FromBody] string newRole)
            {
                if (!IsAdmin()) return Forbid();
                bool success = _repo.ChangeRole(id, newRole);
                return success ? Ok("Role updated.") : NotFound();
            }

            // 3. Ban/Suspend user
            [HttpPut("{id}/status")]
            public IActionResult ChangeStatus(int id, [FromBody] bool banned)
            {
                if (!IsAdmin()) return Forbid();
                bool success = _repo.SetBanStatus(id, banned);
                return success ? Ok("User banned/suspended.") : NotFound();
            }

            // 4. Delete user
            [HttpDelete("{id}")]
            public IActionResult DeleteUser(int id)
            {
                if (!IsAdmin()) return Forbid();
                bool success = _repo.Delete(id);
                return success ? Ok("User deleted.") : NotFound();
            }

            // 5. Get single user
            [HttpGet("{id}")]
            public IActionResult GetUser(int id)
            {
                if (!IsAdmin()) return Forbid();
                var user = _repo.GetUserByIdAsync(id);
                return user != null ? Ok(user) : NotFound();
            }
        }
    }

