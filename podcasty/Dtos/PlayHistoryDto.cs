namespace podcasty.Dtos
{
    public class PlayHistoryDto
    {
        public int PlayHistoryId { get; set; }
        public int EpisodeId { get; set; }
        public DateTime PlayedAt { get; set; }
        public string EpisodeTitle { get; set; }
        public int HistoryId { get; internal set; }
        public int ProgressSeconds { get; internal set; }
        public bool Completed { get; internal set; }
        public DateTime LastPlayed { get; internal set; }
    }
}
