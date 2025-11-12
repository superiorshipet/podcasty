using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(int id);

        Task<bool> UpdateUserAsync(User user);
    }

}
