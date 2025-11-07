using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IUserInteractionRepository
    {
        Task<IEnumerable<UserInteraction>> GetByPodcastAsync(int podcastId);
        Task<IEnumerable<UserInteraction>> GetByUserAsync(int userId);
        Task<UserInteraction> AddAsync(UserInteraction interaction);
        Task<bool> DeleteAsync(int interactionId);
    }
}
