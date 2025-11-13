
export interface User {
  id: string;
  username: string;
  email: string;
  initial?: string; 
  avatarUrl?: string;
  bio?: string;
}

export interface Podcast {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  description: string;
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
}

export interface Category {
  id: string;
  label: string;
}