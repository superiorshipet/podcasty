using System.ComponentModel.DataAnnotations;

namespace podcasty.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string? Icon { get; set; }

        public ICollection<Podcast> Podcasts { get; set; }
    }
}
