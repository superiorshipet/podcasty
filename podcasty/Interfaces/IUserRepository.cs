using podcasty.Models;

namespace podcasty.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<bool> UpdateUserAsync(User user);
        IEnumerable<User> GetByEmail(string email);
        IEnumerable<User> GetByName(string name);
        IEnumerable<User> GetAll();
        bool ChangeRole(int id, string newRole);
        bool SetBanStatus(int id, bool banned);
        bool Delete(int id);

    }

}
