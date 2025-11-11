using Microsoft.EntityFrameworkCore;
using podcasty.Dtos;
using podcasty.Interfaces;
using podcasty.Models;
namespace podcasty.Repos { 
public class PlayHistoryRepository : IPlayHistoryRepository
{
    private readonly AppDbContext _db;
    public PlayHistoryRepository(AppDbContext db) { _db = db; }

    public async Task<PlayHistory> AddAsync(int userId, PlayHistoryCreateDto dto)
    {
        var history = new PlayHistory
        {
            UserId = userId,
            EpisodeId = dto.EpisodeId,
            ProgressSeconds = dto.ProgressSeconds,
            Completed = dto.Completed,
            LastPlayed = DateTime.UtcNow
        };
        _db.PlayHistories.Add(history);
        await _db.SaveChangesAsync();
        return history;
    }

    public async Task<PlayHistory> UpdateAsync(int userId, int historyId, PlayHistoryCreateDto dto)
    {
        var history = await _db.PlayHistories
            .FirstOrDefaultAsync(h => h.HistoryId == historyId && h.UserId == userId);

        if (history == null) return null;

        history.ProgressSeconds = dto.ProgressSeconds;
        history.Completed = dto.Completed;
        history.LastPlayed = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return history;
    }

    public async Task<bool> DeleteAsync(int userId, int historyId)
    {
        var history = await _db.PlayHistories
            .FirstOrDefaultAsync(h => h.HistoryId == historyId && h.UserId == userId);

        if (history == null) return false;

        _db.PlayHistories.Remove(history);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<PlayHistory>> GetByUserAsync(int userId)
    {
        return await _db.PlayHistories
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.LastPlayed)
            .ToListAsync();
    }
} }

