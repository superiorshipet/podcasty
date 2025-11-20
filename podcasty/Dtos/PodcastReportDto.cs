namespace podcasty.Dtos
{
    public class PodcastReportDto
    {
        public int PodcastId { get; set; }
        public string Title { get; set; }
        public int PlayCount { get; set; }
        public DateTime CreatedAt {  get; set; }
    }
}
