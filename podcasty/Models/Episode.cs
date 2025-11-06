using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class Episode
    {
        [Key]
        public int EpisodeId { get; set; }
        public int PodcastId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AudioFile { get; set; }
        public int Duration { get; set; }
        public int EpisodeNumber { get; set; }
        public int PlayCount { get; set; }
        public DateTime PublishedAt { get; set; }
        public Podcast Podcast { get; set; }
    }
}
