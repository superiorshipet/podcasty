using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using podcasty.DTOs;
using podcasty.Enums;
using podcasty.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace podcasty.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        public UserController(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (ModelState.IsValid)
            {
                User user = new User()
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                    Role=UserRole.User,
                    CreatedAt = DateTime.UtcNow,   
                    UpdatedAt = DateTime.UtcNow,
                };
                IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);
                if (result.Succeeded)
                {
                    return Ok("Account Registered Succefully");
                }
                return BadRequest(result.Errors);

            }
            return BadRequest(ModelState);
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (ModelState.IsValid)
            {
                User login = await _userManager.FindByNameAsync(loginDto.UserName);
                if (login != null)
                {
                    bool fond = await _userManager.CheckPasswordAsync(login, loginDto.Password);
                    if (fond)
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name,login.UserName),
                            new Claim(ClaimTypes.NameIdentifier,login.Id.ToString()),
                             new Claim(ClaimTypes.Role, login.Role.ToString())
                        };
                        SecurityKey securityKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
                        SigningCredentials signingCredentials =
                            new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                        JwtSecurityToken token = new JwtSecurityToken(

                            issuer: _configuration["JWT:ValidIssuer"],
                            audience: _configuration["JWT:ValidAudience"],
                            claims: claims,
                            expires: DateTime.UtcNow.AddDays(1),
                            signingCredentials: signingCredentials
                            );
                        return Ok(
                                new
                                {
                                    Token = new JwtSecurityTokenHandler().WriteToken(token)
                                }
                        );
                    }

                }
                return Unauthorized();
            }
            return Unauthorized();
        }
    }
}
