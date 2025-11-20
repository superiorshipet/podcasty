using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IFilteringRepository
    {
        Task<List<Episode>> FilterByCatogry(int categoryId);
    }
}
