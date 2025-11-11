using System.ComponentModel.DataAnnotations;

namespace podcasty.DTOs
{
    public class PlayHistoryDetailsDto
    {
        public int userId {  get; set; }
        public int History_Id { get; set; }
        public int Podcast_Id { get; set; }
        public int Episode_Id { get; set; }
        public string Episode_Title { get; set; }
        public string Episode_Description { get; set; }
        public int Episode_Number { get; set; }
        public DateTime Publised_At { get; set; }
        public int Play_Count { get; set; }
        public int progress_seconds { get; set; }
        public bool Completed { get; set; }
        public DateTime Last_Played { get; set; }

    }
}
