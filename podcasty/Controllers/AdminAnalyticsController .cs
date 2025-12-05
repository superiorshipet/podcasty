using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using System.Security.Claims;

[ApiController]
[Route("api/admin/analytics")]
[Authorize]
public class AdminAnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _repo;
    public AdminAnalyticsController(IAnalyticsRepository repo)
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

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        if (!IsAdmin()) return Forbid();
        return Ok(await _repo.GetStatsAsync());
    }

    [HttpGet("top-podcasts")]
    public async Task<IActionResult> GetTopPodcasts([FromQuery] int count = 10)
    {
        if (!IsAdmin()) return Forbid();
        return Ok(await _repo.GetTopPodcastsAsync(count));
    }

    [HttpGet("top-users")]
    public async Task<IActionResult> GetTopUsers([FromQuery] int count = 10)
    {
        if (!IsAdmin()) return Forbid();
        return Ok(await _repo.GetTopUsersAsync(count));
    }
}
