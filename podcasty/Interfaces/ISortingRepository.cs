using Microsoft.IdentityModel.Tokens;
using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface ISortingRepository
    {
        Task<List<Episode>> SortByTimeDescending();
        Task<List<Episode>> SortByTimeAscending();
        Task<List<Episode>> SortByDurationDescending();
        Task<List<Episode>> SortByDurationAscending();
        Task<List<Episode>> SortByViewsAscending();
        Task<List<Episode>> SortByViewsDescending();

    }
}
