namespace podcasty.Dtos
{
    public class EditCommentDto
    {
        public int InteractionId { get; set; }
        public int UserId { get; set; }            // Optional—get from auth if you prefer
        public string Content { get; set; }
    }
}
