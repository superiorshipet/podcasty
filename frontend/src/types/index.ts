export interface User {
  id: number;
  userName: string;
  email: string;
  role: string; // "User", "Creator", "Admin"
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  isBanned?: boolean;
  token?: string;
  initial?: string; // خاص بالواجهة الأمامية
}

export interface LoginData {
  userName: string;
  password: string;
}

export interface SignupData {
  userName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserData {
  name?: string;
  profilePicture?: string;
  bio?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface Podcast {
  podcastId: number;
  creatorId: number;
  categoryId: number;
  title: string;
  description: string;
  coverImage: string;
  status: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  creator?: User; 
  episodes?: Episode[];
}

export interface PodcastCreateData {
  categoryId: number;
  title: string;
  description?: string;
  coverImage?: string;
  status: number;
}

export interface PodcastUpdateData {
  podcastId: number;
  title: string;
  description?: string;
  coverImage?: string;
  categoryId: number;
  status: number;
}

export interface Episode {
  episodeId: number;
  podcastId: number;
  title: string;
  description: string;
  audioFile: string;
  duration: number;
  episodeNumber: number;
  playCount: number;
  publishedAt: string;
  isApproved: boolean;
}

export interface EpisodeCreateData {
  podcastId: number;
  title: string;
  description: string;
  audioFile: string;
  duration?: number;
  episodeNumber?: number;
  publishedAt?: string;
}

export interface EpisodeUpdateData {
  episodeId: number;
  podcastId: number;
  title: string;
  description: string;
  audioFile: string;
  duration?: number;
  episodeNumber?: number;
  playCount: number;
  publishedAt: string;
}

export interface Category {
  categoryId: number;
  name: string;
  icon?: string;
  id?: string | number; // للتوافق مع بعض المكونات القديمة
  label?: string;       // للتوافق مع بعض المكونات القديمة
}

export interface UserInteraction {
  interactionId: number;
  userId: number;
  podcastId: number;
  interaction: number;
  commentContent?: string;
  createdAt: string;
  user?: User;
}

export interface EditCommentData {
  interactionId: number;
  userId: number;
  content: string;
}

export interface AdminStats {
  totalPodcasts: number;
  totalEpisodes: number;
  totalUsers: number;
  totalComments: number;
  totalPodcastPlays: number;
}

export interface TopPodcast {
  podcastId: number;
  title: string;
  playCount: number;
}

export interface TopUser {
  userId: number;
  userName: string;
  interactionCount: number;
}

export interface SearchResult {
  podcasts: { podcastId: number, title: string, description: string, coverImage: string }[];
  episodes: { episodeId: number, title: string, podcastId: number, duration: number }[];
  users: { userId: number, username: string, profilePicture: string }[];
  categories: Category[];
}

export interface PlayHistoryCreateData {
    episodeId: number;
    progressSeconds: number;
    completed: boolean;
}

export interface PlayHistory {
  historyId: number;
  episodeId: number;
  episodeTitle?: string;
  progressSeconds: number;
  completed: boolean;
  lastPlayed: string;
}