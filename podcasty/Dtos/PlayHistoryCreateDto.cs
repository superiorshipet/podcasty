namespace podcasty.Dtos
{
    public class PlayHistoryCreateDto
    {
        public int EpisodeId { get; set; }
        public int ProgressSeconds { get; set; }
        public bool Completed { get; set; }
    }
}
