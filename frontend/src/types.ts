// المسار: src/types.ts

export interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
  token?: string;
  profilePicture?: string;
  bio?: string;
  isBanned?: boolean;
  initial?: string;
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
  email?: string;
  username?: string;
  avatarUrl?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
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

export interface PlayHistoryCreateData {
  episodeId: number;
  progressSeconds: number;
  completed: boolean;
}

export interface EditCommentData {
  interactionId: number;
  userId: number;
  content: string;
}

// تعريفات إضافية قد تحتاجها الواجهة
export interface Category {
  categoryId?: number;
  name?: string;
  icon?: string;
  id?: string | number;
  label?: string;
}

export interface Podcast {
  podcastId: number;
  title: string;
  description: string;
  coverImage: string;
  creatorId: number;
  creator?: User;
  episodes?: Episode[];
}

export interface Episode {
  episodeId: number;
  title: string;
  description: string;
  audioFile: string;
  duration: number;
  podcastId: number;
  publishedAt?: string;
}

export interface PlayHistory {
  historyId: number;
  episodeId: number;
  episodeTitle?: string;
  progressSeconds: number;
  completed: boolean;
  lastPlayed: string;
}

export interface AdminStats {
  totalPodcasts: number;
  totalEpisodes: number;
  totalUsers: number;
  totalComments: number;
  totalPodcastPlays: number;
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