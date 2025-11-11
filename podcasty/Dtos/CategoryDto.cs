namespace podcasty.Dtos
{
    public class CategoryDto
    {
        public string Name { get; set; }
        public string? Icon { get; set; }
        public int CategoryId { get; internal set; }
    }
}
