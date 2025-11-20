using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using podcasty.Interfaces;
using podcasty.Models;
using System;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;

namespace podcasty.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SortAndFilterController : ControllerBase
    {
        private readonly ISortingRepository _sortRepo;
        private readonly IFilteringRepository _filterRepo;
        public SortAndFilterController(ISortingRepository sortRepo, IFilteringRepository filterRepo)
        {
            _sortRepo = sortRepo;
            _filterRepo = filterRepo;
        }
        [HttpGet("Filter")]
        public async Task<IActionResult> FilterByCategory(int categoryId)
        {
            var filter = await _filterRepo.FilterByCatogry(categoryId);
            if (filter.Any())
            {
                return NotFound("No Episodes Found For This Category");
            }
                return Ok(filter);
        }
        [HttpGet("sortbytime-asc")]
        public async Task<IActionResult> SortByTimeAscending()
        {
            var episodes = await _sortRepo.SortByTimeAscending();
            if (episodes == null)
            {
                return NotFound("No Episodes Found");
            }
            return Ok(episodes);
        }
        [HttpGet("sortbytime-desc")]
        public async Task<IActionResult> SortByTimeDescending()
        {
            var episodes = await _sortRepo.SortByTimeDescending();
            if (episodes == null)
            {
                return NotFound("No Episodes Found");
            }
            return Ok(episodes);
        }
        [HttpGet("sortbyduration-asc")]
        public async Task<IActionResult> SortByDurationAscending()
        {
            var episodes = await _sortRepo.SortByDurationAscending();
            if (episodes == null)
            {
                return NotFound("No Episodes Found");
            }
            return Ok(episodes);

        }
        [HttpGet("sortbyduration-desc")]
        public async Task<IActionResult> SortByDurationDescending()
        {
            var episodes = await _sortRepo.SortByDurationDescending();
            if (episodes == null)
            {
                return NotFound("No Episodes Found");
            }
            return Ok(episodes);
        }
        [HttpGet("sortbyviews-asc")]
        public async Task<IActionResult> SortByViewsAscending()
        {
            var episodes = await _sortRepo.SortByViewsAscending();
            if (episodes == null)
            {
                return NotFound("No Episodes Found");
            }
            return Ok(episodes);
        }
        [HttpGet("sortbyviews-desc")]
        public async Task<IActionResult> SortByViewsDescending()
        {
            var episodes = await _sortRepo.SortByViewsDescending();
            if (episodes == null)
            {
                return NotFound("No Episodes Found");
            }
            return Ok(episodes);
        }
    }
}