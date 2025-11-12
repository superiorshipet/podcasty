namespace podcasty.Dtos
{
    public class SearchDtos
    {
        
        public class PodcastDto
        {
            public int PodcastId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string CoverImage { get; set; }
        }

        public class EpisodeDto
        {
            public int EpisodeId { get; set; }
            public string Title { get; set; }
            public int PodcastId { get; set; }
            public int Duration { get; set; }
        }

        public class UserDto
        {
            public int UserId { get; set; }
            public string Username { get; set; }
            public string ProfilePicture { get; set; }
        }

        public class CategoryDto
        {
            public int CategoryId { get; set; }
            public string Name { get; set; }
            public string Icon { get; set; }
        }

    }
}
