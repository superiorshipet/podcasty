namespace podcasty.Dtos
{
    public class EpisodeCreateDto
    {
        public int PodcastId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AudioFile { get; set; }
        public int? Duration { get; set; }
        public int? EpisodeNumber { get; set; }
        public DateTime? PublishedAt { get; set; }
    }

}
