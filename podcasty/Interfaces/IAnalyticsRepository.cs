using podcasty.Dtos;

namespace podcasty.Interfaces
{
    public interface IAnalyticsRepository
    {
        Task<AdminStatsDto> GetStatsAsync();
        Task<List<TopPodcastDto>> GetTopPodcastsAsync(int count = 10);
        Task<List<TopUserDto>> GetTopUsersAsync(int count = 10);
        Task<List<PodcastReportDto>> GetPodcastReportsAsync(DateTime start, DateTime end);
    }
}
