export interface User {
id: string;
  username: string;
  email: string;
  firstName: string; 
  lastName: string;  
  initial: string;
  avatarUrl: string;
  bio: string;      
}
export interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
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

export interface UpdateUserData {
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
