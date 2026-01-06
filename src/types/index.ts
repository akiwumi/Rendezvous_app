export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  profileImage?: string;
  friends: string[]; // User IDs
  isAdmin?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  image?: string;
  link?: string;
  createdAt: Date;
  likes: string[]; // User IDs who liked
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
  date: Date;
  type: 'party' | 'event' | 'tournament' | 'trip' | 'exhibition' | 'other';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  location?: string;
  attendees: string[]; // User IDs
  maxAttendees?: number;
  createdBy: string; // Admin ID
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  timestamp: Date;
  isAdmin?: boolean;
}

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  messages: Message[];
  isGroup: boolean;
  groupName?: string;
}

