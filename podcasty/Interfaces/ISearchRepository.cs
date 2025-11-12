using static podcasty.Dtos.SearchDtos;

namespace podcasty.Interfaces
{
    public interface ISearchRepository
    {
        Task<IEnumerable<PodcastDto>> SearchPodcastsAsync(string query);
        Task<IEnumerable<EpisodeDto>> SearchEpisodesAsync(string query);
        Task<IEnumerable<UserDto>> SearchUsersAsync(string query);
        Task<IEnumerable<CategoryDto>> SearchCategoriesAsync(string query);
    }
}
