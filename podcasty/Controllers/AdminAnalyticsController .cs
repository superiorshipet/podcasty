using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;

[ApiController]
[Route("api/admin/analytics")]
[Authorize(Roles = "Admin")]
public class AdminAnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _repo;
    public AdminAnalyticsController(IAnalyticsRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() =>
        Ok(await _repo.GetStatsAsync());

    [HttpGet("top-podcasts")]
    public async Task<IActionResult> GetTopPodcasts([FromQuery] int count = 10) =>
        Ok(await _repo.GetTopPodcastsAsync(count));

    [HttpGet("top-users")]
    public async Task<IActionResult> GetTopUsers([FromQuery] int count = 10) =>
        Ok(await _repo.GetTopUsersAsync(count));
}
