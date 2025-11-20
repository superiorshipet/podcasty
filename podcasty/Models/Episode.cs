using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class Episode
    {
        [Key]
        public int EpisodeId { get; set; }
        public int PodcastId { get; set; }
        [Required]
        public string Title { get; set; }
        public bool IsApproved { get; set; } = false;
        public string Description { get; set; }
        [Required]
        public string AudioFile { get; set; }
        public int? Duration { get; set; }
        public int? EpisodeNumber { get; set; }
        public int PlayCount { get; set; }
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        public virtual Podcast Podcast { get; set; }
    }
}
