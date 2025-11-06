using Microsoft.AspNetCore.Identity;
using podcasty.Enums;

namespace podcasty.Models
{
    public class User : IdentityUser<int>
    {
        public string? ProfilePicture { get; set; }
        public UserRole Role { get; set; } // "user", "creator", "admin"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<Podcast> Podcasts { get; set; }
    }
}
