using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }
        
        public int UserId { get; set; }
        
        public int PodcastId { get; set; }
        
        public int? EpisodeId { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        public string Message { get; set; }
        
        public bool IsRead { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Podcast Podcast { get; set; }
        public virtual Episode Episode { get; set; }
    }
}
