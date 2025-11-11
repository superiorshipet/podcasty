namespace podcasty.DTOs
{
    public class UpdateProgressDataDto
    {
        public int userId {  get; set; }
        public int HistoryId { get; set; }
        public int UserId { get; set; }
        public int EpisodeId { get; set; }
        public int ProgressSeconds { get; set; }
        public bool Completed { get; set; }
        public DateTime LastPlayed { get; set; }

    }
}
