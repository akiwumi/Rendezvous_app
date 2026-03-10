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
  coverImage?: string; // Profile header/banner image URL
  friends: string[]; // User IDs
  isAdmin?: boolean;
  likedPosts?: string[]; // Post IDs
  registeredEvents?: string[]; // Event IDs
  eventReminders?: EventReminder[];
  lastLogin?: Date; // Last login timestamp
  createdAt?: Date; // Account creation timestamp
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
  isPaid?: boolean;
  ticketPrice?: number; // in pence/cents
  ticketCurrency?: 'GBP' | 'EUR' | 'USD';
  paymentType?: 'one-time' | 'donation' | 'free';
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
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'video' | 'file';
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
  userId?: string;
  type: 'post' | 'event' | 'announcement' | 'friend' | 'comment' | 'like' | 'message';
  title: string;
  message: string;
  relatedUserId?: string;
  relatedUserName?: string;
  relatedUserImage?: string;
  relatedItemId?: string;
  timestamp: Date;
  read: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  advertiserName: string;
  advertiserUrl: string;        // external website link
  mediaType: 'image' | 'video';
  mediaUrl: string;             // external URL (CDN, YouTube, Vimeo, direct mp4)
  thumbnailUrl?: string;        // video preview image
  allowFullscreen: boolean;
  startDate: Date;
  endDate: Date;
  frequency: number;            // show ad every N announcements (e.g. 3 = after every 3rd post)
  isActive: boolean;
  impressions: number;
  clicks: number;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  paymentAmount: number;        // in pence/cents, for Stripe later
  createdAt: Date;
  createdBy: string;
}

export interface AdminMessage {
  id: string;
  adminId: string;
  userId: string;               // the member being messaged
  senderId: string;             // who sent this message (admin or user)
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
