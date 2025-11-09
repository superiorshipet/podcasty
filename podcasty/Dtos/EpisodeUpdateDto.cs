namespace podcasty.Dtos
{
    public class EpisodeUpdateDto: EpisodeCreateDto
    {
        public int EpisodeId { get; set; }
        public int PodcastId { get; set; }
        public int PlayCount { get; set; }
    }
}
