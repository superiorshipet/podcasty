using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;

namespace podcasty.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchRepository _searchRepository;

        public SearchController(ISearchRepository searchRepository)
        {
            _searchRepository = searchRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Search query cannot be empty.");

            
            var podcasts = await _searchRepository.SearchPodcastsAsync(q);
            var episodes = await _searchRepository.SearchEpisodesAsync(q);
            var users = await _searchRepository.SearchUsersAsync(q);
            var categories = await _searchRepository.SearchCategoriesAsync(q);

            var result = new
            {
                Podcasts = podcasts,
                Episodes = episodes,
                Users = users,
                Categories = categories
            };

            return Ok(result);
        }
    }
}
