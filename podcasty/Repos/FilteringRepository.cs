using Microsoft.EntityFrameworkCore;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Repos
{
    public class FilteringRepository:IFilteringRepository
    {
        private readonly AppDbContext _db;

        public FilteringRepository(AppDbContext db)
        {
            _db = db;
        }
        public async Task<List<Episode>> FilterByCatogry(int categoryId)
        {
            var episodes=await _db.Episodes.Include(x=>x.Podcast).Where(x=>x.Podcast.CategoryId == categoryId).ToListAsync();
            return episodes;
        }
    }
}
