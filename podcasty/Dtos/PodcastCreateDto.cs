namespace podcasty.Dtos
{
    public class PodcastCreateDto
    {

        public int CategoryId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? CoverImage { get; set; }
        public Enums.PodcastStatus Status { get; set; }
    }
}
