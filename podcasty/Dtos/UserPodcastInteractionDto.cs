namespace podcasty.Dtos
{
    public class UserPodcastInteractionDto
    {
        public int UserId { get; set; }
        public int PodcastId { get; set; }
    }
    public class CommentInputDto : UserPodcastInteractionDto
    {
        public string? Content { get; set; }
    }
}
