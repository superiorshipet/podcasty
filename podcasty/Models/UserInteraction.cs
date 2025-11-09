using podcasty.Enums;
using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class UserInteraction
    {
        [Key]
        public int InteractionId { get; set; }
        public int UserId { get; set; }
        public int PodcastId { get; set; }
        public InteractionType Interaction { get; set; } // "like", "favorite", "follow", "comment"
        public string?CommentContent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual User User { get; set; }
        public virtual Podcast Podcast { get; set; }
    }
}
