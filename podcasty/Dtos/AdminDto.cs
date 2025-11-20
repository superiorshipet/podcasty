namespace podcasty.Dtos
{
    public class AdminDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsBanned { get; set; }
        public string UserName { get; set; }
    }
}
