using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace podcasty.Models
{
    public class Episode
    {
        [Key]
        public int EpisodeId { get; set; }

        [ForeignKey("Podcast")]
        public int PodcastId { get; set; }

        [Required]
        public string Title { get; set; }

        public bool IsApproved { get; set; } = false;

        public string Description { get; set; }

        [Required]
        public string AudioFile { get; set; }

        public string? CoverImage { get; set; }

        public int? Duration { get; set; }

        public int? EpisodeNumber { get; set; }

        public int PlayCount { get; set; }

        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public virtual Podcast Podcast { get; set; }
    }
}