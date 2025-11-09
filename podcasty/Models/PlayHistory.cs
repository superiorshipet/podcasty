using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class PlayHistory
    {
        [Key]
        public int HistoryId { get; set; }
        public int UserId { get; set; }
        public int EpisodeId { get; set; }
        public int ProgressSeconds { get; set; }
        public bool Completed { get; set; }
        public DateTime LastPlayed { get; set; }

        public virtual User User { get; set; }
        public virtual Episode Episode { get; set; }
    }
}
