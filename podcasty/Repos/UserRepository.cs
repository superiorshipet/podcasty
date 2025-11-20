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
        public IEnumerable<User> GetByEmail(string email)
        {
            return _userManager.Users.Where(u => u.Email == email).ToList();
        }
        public IEnumerable<User> GetAll()
        {
            return _userManager.Users.ToList();
        }
        public bool ChangeRole(int id, string newRole)
        {
            var user = _userManager.FindByIdAsync(id.ToString()).Result;
            if (user == null) return false;
            var removeResult = _userManager.RemoveFromRolesAsync(user, _userManager.GetRolesAsync(user).Result).Result;
            if (!removeResult.Succeeded) return false;
            var addResult = _userManager.AddToRoleAsync(user, newRole).Result;
            return addResult.Succeeded;
        }
        public bool SetBanStatus(int id, bool banned)
        {
            var user = _userManager.FindByIdAsync(id.ToString()).Result;
            if (user == null) return false;
            user.IsBanned = banned;
            var result = _userManager.UpdateAsync(user).Result;
            return result.Succeeded;
        }
        public bool Delete(int id)
        {
            var user = _userManager.FindByIdAsync(id.ToString()).Result;
            if (user == null) return false;
            var result = _userManager.DeleteAsync(user).Result;
            return result.Succeeded;
        }
        public IEnumerable<User> GetByName(string name)
        {
            return _userManager.Users.Where(u => u.UserName.Contains(name)).ToList();
        }
    }

}
