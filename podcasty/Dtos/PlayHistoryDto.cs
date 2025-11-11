namespace podcasty.Dtos
{
    public class PlayHistoryDto
    {
        public int HistoryId { get; set; }
        public int EpisodeId { get; set; }
        public string EpisodeTitle { get; set; }
        public int ProgressSeconds { get; set; }
        public bool Completed { get; set; }
        public DateTime LastPlayed { get; set; }
    }
}
