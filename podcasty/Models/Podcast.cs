using podcasty.Enums;
using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class Podcast
    {
        [Key]
        public int PodcastId { get; set; }
        public int CreatorId { get; set; }
        public int CategoryId { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsApproved { get; set; } = false;
        public string? CoverImage { get; set; }
        public PodcastStatus Status { get; set; }
        public int PlayCount { get; set; }
        public DateTime CreatedAt { get; set; }=  DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }= DateTime.UtcNow;

        // Navigation properties
        public virtual User Creator { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<Episode> Episodes { get; set; }
    }
}
