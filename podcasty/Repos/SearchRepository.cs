using Microsoft.EntityFrameworkCore;
using podcasty.Dtos;
using podcasty.Interfaces;
using static podcasty.Dtos.SearchDtos;

namespace podcasty.Repos
{
    public class SearchRepository : ISearchRepository
    {
        private readonly AppDbContext _context;

        public SearchRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<SearchDtos.CategoryDto>> SearchCategoriesAsync(string query)
        {
            return await _context.Categories
           .Where(c => c.Name.Contains(query))
           .Select(c => new SearchDtos.CategoryDto
           {
               CategoryId = c.CategoryId,
               Name = c.Name,
               Icon = c.Icon
           })
           .ToListAsync();
        }

        public async Task<IEnumerable<EpisodeDto>> SearchEpisodesAsync(string query)
        {
            return await _context.Episodes
                .Where(e => e.Title.Contains(query) || e.Description.Contains(query))
                .Select(e => new EpisodeDto
                {
                    EpisodeId = e.EpisodeId,
                    Title = e.Title,
                    PodcastId = e.PodcastId,
                    Duration = (int)e.Duration
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<PodcastDto>> SearchPodcastsAsync(string query)
        {
            return await _context.Podcasts
                .Where(p => p.Title.Contains(query) || p.Description.Contains(query))
                .Select(p => new PodcastDto
                {
                    PodcastId = p.PodcastId,
                    Title = p.Title,
                    Description = p.Description,
                    CoverImage = p.CoverImage
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<UserDto>> SearchUsersAsync(string query)
        {
            return await _context.Users
                .Where(u => (u.UserName ?? "").Contains(query))
                .Select(u => new UserDto
                {
                    UserId = u.Id,
                    Username = u.UserName,
                    ProfilePicture = u.ProfilePicture
                })
                .ToListAsync();
        }

    }
}
