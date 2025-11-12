using Microsoft.AspNetCore.Identity;
using podcasty.Interfaces;
using podcasty.Models;

namespace podcasty.Repos
{
    public class UserRepository : IUserRepository
    {

        private readonly UserManager<User> _userManager;
        public UserRepository(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userManager.FindByIdAsync(id.ToString());
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded;
        }
    }
}
