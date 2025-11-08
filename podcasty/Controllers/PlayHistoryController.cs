using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using podcasty.DTOs;
using podcasty.Models;
using podcasty.Repositories;
using System.Security.Claims;

namespace podcasty.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayHistoryController : ControllerBase
    {
        private readonly IPlayHistoryRepository _repo;
        private readonly AppDbContext _db;
        public PlayHistoryController(IPlayHistoryRepository repo, AppDbContext db)
        {
            _repo = repo;
            _db = db;

        }
        //View a list of watched episodes
        [HttpGet("Play_History/{userId}")]
        public async Task<IActionResult> GetPlayHistoryAsync()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var PlayHistoryList = await _repo.GetPlayHistoryAsync(userId);
            if (PlayHistoryList == null || userId == null)
            {
                return BadRequest();
            }
            return Ok(PlayHistoryList);
        }
        [HttpPost("Update_Progress")]
        public async Task<IActionResult> Update_Progress(UpdateProgressDataDto playHistory)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            await _repo.UpdateProgressAsync(userId, playHistory);
            return Ok("Progress Updated Successfully");
        }
        
    }
}
