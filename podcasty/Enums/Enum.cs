namespace podcasty.Enums
{
    
        public enum UserRole
        { User, 
        Creator,
        Admin }

        public enum PodcastStatus
        { Pending, 
        Approved,
        Rejected,
        Deleted,
        Active}

        public enum InteractionType 
        { Like,
        Favorite,
        Follow,
        Comment,
        Dislike}

        public enum ActionType
        {
        Approve, 
        Reject, 
        Delete }  
}
