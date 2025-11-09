using podcasty.Models;
using podcasty.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace podcasty.Repos
{
    public class EpisodeRepository : IEpisodeRepository
    {
        private readonly AppDbContext _db;
        public EpisodeRepository(AppDbContext db) => _db = db;

        public async Task<Episode> AddAsync(Episode episode)
        {
            _db.Episodes.Add(episode);
            await _db.SaveChangesAsync();
            return episode;
        }

        public async Task<Episode?> GetByIdAsync(int id)
            => await _db.Episodes.FindAsync(id);

        public async Task<List<Episode>> GetByPodcastAsync(int podcastId)
            => await _db.Episodes.Where(e => e.PodcastId == podcastId).ToListAsync();

        public async Task<bool> UpdateAsync(Episode updated)
        {
            var ep = await _db.Episodes.FindAsync(updated.EpisodeId);
            if (ep == null) return false;
            ep.Title = updated.Title;
            ep.Description = updated.Description;
            ep.AudioFile = updated.AudioFile;
            ep.Duration = updated.Duration;
            ep.EpisodeNumber = updated.EpisodeNumber;
            ep.PlayCount = updated.PlayCount;
            ep.PublishedAt = updated.PublishedAt;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ep = await _db.Episodes.FindAsync(id);
            if (ep == null) return false;
            _db.Episodes.Remove(ep);
            await _db.SaveChangesAsync();
            return true;
        }
    }

}
