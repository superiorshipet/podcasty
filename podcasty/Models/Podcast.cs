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
        public string Title { get; set; }
        public string Description { get; set; }
        public string CoverImage { get; set; }
        public PodcastStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public User Creator { get; set; }
        public Category Category { get; set; }
        public ICollection<Episode> Episodes { get; set; }
    }
}
