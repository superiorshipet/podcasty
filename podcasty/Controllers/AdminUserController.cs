using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Controllers
{
        [ApiController]
        [Route("api/admin/users")]
        [Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
        {
            private readonly IUserRepository _repo;

            public AdminUserController(IUserRepository repo)
            {
                _repo = repo;
            }

            // 1. List all users 
            [HttpGet]
            public IActionResult GetUsers([FromQuery] string email = null, [FromQuery] string name = null)
            {
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
                bool success = _repo.ChangeRole(id, newRole);
                return success ? Ok("Role updated.") : NotFound();
            }

            // 3. Ban/Suspend user
            [HttpPut("{id}/status")]
            public IActionResult ChangeStatus(int id, [FromBody] bool banned)
            {
                bool success = _repo.SetBanStatus(id, banned);
                return success ? Ok("User banned/suspended.") : NotFound();
            }

            // 4. Delete user
            [HttpDelete("{id}")]
            public IActionResult DeleteUser(int id)
            {
                bool success = _repo.Delete(id);
                return success ? Ok("User deleted.") : NotFound();
            }

            // 5. Get single user
            [HttpGet("{id}")]
            public IActionResult GetUser(int id)
            {
                var user = _repo.GetUserByIdAsync(id);
                return user != null ? Ok(user) : NotFound();
            }
        }
    }

