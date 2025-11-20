using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IUserInteractionRepository
    {
        Task<IEnumerable<UserInteraction>> GetByPodcastAsync(int podcastId);
        Task<IEnumerable<UserInteraction>> GetByUserAsync(int userId);
        Task<UserInteraction> AddAsync(UserInteraction interaction);
        Task<bool> DeleteAsync(int interactionId);
        Task<bool> UpdateCommentContent(int interactionId, int userId, string newContent);
        Task<UserInteraction> GetInteractionByIdAsync(int interactionId);
        Task<UserInteraction> GetByIdAsync(int id);
        Task<UserInteraction>GetCommentByIdAsync(int commentId);
        Task<UserInteraction> GetCommentsAsync(int userId);
        Task<UserInteraction> GetAllAsync();
    }
}
