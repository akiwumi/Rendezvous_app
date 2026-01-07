export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  bio?: string;
  password?: string; // Only used during registration
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  profileImage?: string;
  friends: string[]; // User IDs
  isAdmin?: boolean;
  likedPosts?: string[]; // Post IDs
  registeredEvents?: string[]; // Event IDs
  eventReminders?: EventReminder[];
}

export interface EventReminder {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  reminderTime: Date;
  notified: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  headline?: string; // Post headline/title
  content: string;
  image?: string;
  link?: string;
  postType?: 'event' | 'announcement' | 'regular'; // Type of post
  eventDate?: Date; // Date and time for event/announcement
  deadline?: Date; // Registration deadline
  location?: string; // Location for events
  interestedUsers?: string[]; // User IDs who registered interest
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

export interface Notification {
  id: string;
  type: 'post' | 'event' | 'announcement' | 'friend' | 'comment' | 'like' | 'message';
  title: string;
  message: string;
  relatedUserId?: string;
  relatedUserName?: string;
  relatedUserImage?: string;
  relatedItemId?: string; // Post ID, Event ID, etc.
  timestamp: Date;
  read: boolean;
}
