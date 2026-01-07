import { User, Post, Event, Notification } from '../types';

// Convert database snake_case to TypeScript camelCase
export const dbToUser = (dbUser: any): User => ({
  id: dbUser.id,
  fullName: dbUser.full_name,
  email: dbUser.email,
  phone: dbUser.phone || '',
  address: dbUser.address,
  bio: dbUser.bio,
  profileImage: dbUser.profile_image,
  socialLinks: dbUser.social_links || {},
  isAdmin: dbUser.is_admin || false,
  friends: dbUser.friends || [],
  likedPosts: dbUser.liked_posts || [],
  registeredEvents: dbUser.registered_events || [],
  eventReminders: dbUser.event_reminders || [],
});

// Convert TypeScript camelCase to database snake_case
export const userToDb = (user: Partial<User>): any => ({
  id: user.id,
  full_name: user.fullName,
  email: user.email,
  phone: user.phone,
  address: user.address,
  bio: user.bio,
  profile_image: user.profileImage,
  social_links: user.socialLinks,
  is_admin: user.isAdmin,
  friends: user.friends,
  liked_posts: user.likedPosts,
  registered_events: user.registeredEvents,
});

// Convert database post to TypeScript post
export const dbToPost = (dbPost: any): Post => ({
  id: dbPost.id,
  authorId: dbPost.author_id,
  authorName: dbPost.author_name,
  authorImage: dbPost.author_image,
  headline: dbPost.headline,
  content: dbPost.content,
  image: dbPost.image,
  link: dbPost.link,
  postType: dbPost.post_type as 'event' | 'announcement' | 'regular' | undefined,
  eventDate: dbPost.event_date ? new Date(dbPost.event_date) : undefined,
  deadline: dbPost.deadline ? new Date(dbPost.deadline) : undefined,
  location: dbPost.location,
  interestedUsers: dbPost.interested_users || [],
  createdAt: new Date(dbPost.created_at),
  likes: dbPost.likes || [],
  comments: dbPost.comments || [],
});

// Convert TypeScript post to database post
export const postToDb = (post: Partial<Post>): any => ({
  id: post.id,
  author_id: post.authorId,
  author_name: post.authorName,
  author_image: post.authorImage,
  headline: post.headline,
  content: post.content,
  image: post.image,
  link: post.link,
  post_type: post.postType,
  event_date: post.eventDate instanceof Date ? post.eventDate.toISOString() : post.eventDate,
  deadline: post.deadline instanceof Date ? post.deadline.toISOString() : post.deadline,
  location: post.location,
  interested_users: post.interestedUsers,
  created_at: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
  likes: post.likes,
  comments: post.comments,
});

// Convert database event to TypeScript event
export const dbToEvent = (dbEvent: any): Event => {
  // If attendees is already an array (from join or manual assignment), use it
  // Otherwise, it should be loaded separately from event_attendees table
  const attendees = Array.isArray(dbEvent.attendees) 
    ? dbEvent.attendees 
    : (dbEvent.attendees || []);
    
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    image: dbEvent.image,
    date: new Date(dbEvent.date),
    location: dbEvent.location,
    attendees: attendees,
    maxAttendees: dbEvent.max_attendees,
    createdBy: dbEvent.created_by,
  };
};

// Convert TypeScript event to database event
export const eventToDb = (event: Partial<Event>): any => ({
  id: event.id,
  title: event.title,
  description: event.description,
  image: event.image,
  date: event.date instanceof Date ? event.date.toISOString() : event.date,
  location: event.location,
  max_attendees: event.maxAttendees,
  created_by: event.createdBy,
});

// Convert database notification to TypeScript notification
export const dbToNotification = (dbNotif: any): Notification => ({
  id: dbNotif.id,
  type: dbNotif.type,
  title: dbNotif.title,
  message: dbNotif.message,
  relatedUserId: dbNotif.related_user_id,
  relatedUserName: dbNotif.related_user_name,
  relatedUserImage: dbNotif.related_user_image,
  relatedItemId: dbNotif.related_item_id,
  timestamp: new Date(dbNotif.timestamp),
  read: dbNotif.read || false,
});

// Convert TypeScript notification to database notification
export const notificationToDb = (notif: Partial<Notification> & { userId?: string }): any => ({
  id: notif.id,
  user_id: notif.userId,
  type: notif.type,
  title: notif.title,
  message: notif.message,
  related_user_id: notif.relatedUserId,
  related_user_name: notif.relatedUserName,
  related_user_image: notif.relatedUserImage,
  related_item_id: notif.relatedItemId,
  timestamp: notif.timestamp instanceof Date ? notif.timestamp.toISOString() : notif.timestamp,
  read: notif.read,
});

