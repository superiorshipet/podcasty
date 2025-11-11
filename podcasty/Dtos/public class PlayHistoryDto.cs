namespace podcasty.Dtos
{
    public class public_class_PlayHistoryDto
    {
        public int HistoryId { get; set; }
        public int EpisodeId { get; set; }
        public int ProgressSeconds { get; set; }
        public bool Completed { get; set; }
        public DateTime LastPlayed { get; set; }
    }
}
