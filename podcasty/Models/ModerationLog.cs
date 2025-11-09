using podcasty.Enums;
using podcasty.Models;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

public class ModerationLog
{
    [Key]
    public int LogId { get; set; }
    public int AdminId { get; set; }
    public int PodcastId { get; set; }
    public ActionType Action { get; set; } // "approve", "reject", "delete"
    public string Reason { get; set; }
    public DateTime ActionDate { get; set; }

    public virtual User Admin { get; set; }
    public virtual Podcast Podcast { get; set; }
}
