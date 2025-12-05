using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace podcasty.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicStatsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PublicStatsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublicStats()
        {
            var usersCount = await _db.Users.CountAsync();
            var podcastsCount = await _db.Podcasts.CountAsync();
            var episodesCount = await _db.Episodes.CountAsync();

            return Ok(new
            {
                UsersCount = usersCount,
                PodcastsCount = podcastsCount,
                EpisodesCount = episodesCount
            });
        }
    }
}
