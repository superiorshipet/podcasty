namespace podcasty.Dtos
{
    public class EpisodeUpdateDto: EpisodeCreateDto
    {
        public int EpisodeId { get; set; }
        public int PodcastId { get; set; }
        public int PlayCount { get; set; }
        public string AudioFile { get; set; }
        public DateTime PublishedAt { get; set; }

    }
}
