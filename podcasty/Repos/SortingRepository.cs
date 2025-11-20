using Microsoft.EntityFrameworkCore;
using podcasty.Interfaces;
using podcasty.Models;
using System.Linq;

namespace podcasty.Repos
{
    public class SortingRepository : ISortingRepository
    {
        private readonly AppDbContext _db;
        public SortingRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Episode>> SortByDurationAscending()
        {
            var episodes = await _db.Episodes.OrderBy(x => x.Duration).ToListAsync();
            return episodes;
        }

        public async Task<List<Episode>> SortByDurationDescending()
        {
            var episodes = await _db.Episodes.OrderByDescending(x => x.Duration).ToListAsync();
            return episodes;
        }

        public async Task<List<Episode>> SortByTimeAscending()
        {
            var episodes = await _db.Episodes.OrderBy(x => x.PublishedAt).ToListAsync();
            return episodes;
        }

        public async Task<List<Episode>> SortByTimeDescending()
        {
            var episodes = await _db.Episodes.OrderByDescending(x => x.PublishedAt).ToListAsync();
            return episodes;
        }

        public async Task<List<Episode>> SortByViewsAscending()
        {
            var episodes = await _db.Episodes.OrderBy(x => x.PlayCount).ToListAsync();
            return episodes;
        }

        public async Task<List<Episode>> SortByViewsDescending()
        {
            var episodes = await _db.Episodes.OrderByDescending(x => x.PlayCount).ToListAsync();
            return episodes;
        }
    }
}
