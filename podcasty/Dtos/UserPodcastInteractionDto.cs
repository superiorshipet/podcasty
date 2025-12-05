namespace podcasty.Dtos
{
    public class UserPodcastInteractionDto
    {
        // ✅ UserId يمكن أن يكون 0 أو null، سيتم استخراجه من الـ JWT Token في الـ Controller
        public int UserId { get; set; } = 0;
        public int PodcastId { get; set; }
    }
    public class CommentInputDto : UserPodcastInteractionDto
    {
        public string? Content { get; set; }
    }
}
