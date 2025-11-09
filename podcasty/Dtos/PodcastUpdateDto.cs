namespace podcasty.Dtos
{
    public class PodcastUpdateDto
    {
        public int PodcastId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? CoverImage { get; set; }
        public int CategoryId { get; set; }
        public Enums.PodcastStatus Status { get; set; }
    }
}
