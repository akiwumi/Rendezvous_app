/**
 * Local Data Service
 * Replaces Supabase with in-memory storage and localStorage persistence
 */

import { User, Post, Event, Notification, Announcement } from '../types';
import { adminUser, dummyUsers, dummyPosts, dummyEvents, dummyAnnouncements } from '../data/dummyData';

// Storage keys for localStorage
const STORAGE_KEYS = {
  users: 'rendezvous_users',
  posts: 'rendezvous_posts',
  events: 'rendezvous_events',
  announcements: 'rendezvous_announcements',
  notifications: 'rendezvous_notifications',
  currentUser: 'rendezvous_current_user',
  invitationCodes: 'rendezvous_invitation_codes',
};

// Helper functions for localStorage
const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Initialize data from localStorage or use defaults
const initializeData = () => {
  const users = storage.get<User[]>(STORAGE_KEYS.users, [adminUser, ...dummyUsers]);
  const posts = storage.get<Post[]>(STORAGE_KEYS.posts, dummyPosts);
  const events = storage.get<Event[]>(STORAGE_KEYS.events, dummyEvents);
  const announcements = storage.get<Announcement[]>(STORAGE_KEYS.announcements, dummyAnnouncements);
  const notifications = storage.get<Notification[]>(STORAGE_KEYS.notifications, []);
  
  return { users, posts, events, announcements, notifications };
};

// Initialize data
let { users, posts, events, announcements, notifications } = initializeData();

// Save data to localStorage
const saveUsers = () => storage.set(STORAGE_KEYS.users, users);
const savePosts = () => storage.set(STORAGE_KEYS.posts, posts);
const saveEvents = () => storage.set(STORAGE_KEYS.events, events);
const saveAnnouncements = () => storage.set(STORAGE_KEYS.announcements, announcements);
const saveNotifications = () => storage.set(STORAGE_KEYS.notifications, notifications);

// Generate IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Authentication Service
export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: generateId('user'),
      email: email.toLowerCase(),
      fullName: userData.fullName || email.split('@')[0],
      phone: userData.phone || '',
      address: userData.address || '',
      profileImage: userData.profileImage || '/pebbles.jpg',
      socialLinks: userData.socialLinks || {},
      friends: [],
      likedPosts: [],
      registeredEvents: [],
      isAdmin: false,
    };
    
    users.push(newUser);
    saveUsers();
    
    // Save current user to localStorage
    localStorage.setItem(STORAGE_KEYS.currentUser, newUser.id);
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        user_metadata: {
          full_name: newUser.fullName,
          phone: newUser.phone,
          address: newUser.address,
        },
      },
      session: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      },
    };
  },

  async signIn(email: string, password: string) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    // Simple password check (in real app, passwords would be hashed)
    // For demo purposes, accept any password for existing users
    // Admin users: akiwumi@gmail.com / 1234, sokina.bobo@example.com / demo123
    
    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.fullName,
          phone: user.phone,
          address: user.address,
        },
      },
      session: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    };
  },

  async signOut() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  },

  async getCurrentUser() {
    const currentUserId = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (!currentUserId) return null;
    
    const user = users.find(u => u.id === currentUserId);
    return user ? {
      id: user.id,
      email: user.email,
      user_metadata: {
        full_name: user.fullName,
        phone: user.phone,
        address: user.address,
      },
    } : null;
  },

  onAuthStateChange(callback: (user: any) => void) {
    // Check for current user on initialization
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      callback(currentUser);
    }
    
    // Return a subscription object (simplified)
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};

// User Service
export const userService = {
  async createUser(userData: User) {
    if (users.find(u => u.id === userData.id)) {
      throw new Error('User already exists');
    }
    users.push(userData);
    saveUsers();
    return userData;
  },

  async getUser(userId: string) {
    const user = users.find(u => u.id === userId);
    return user || null;
  },

  async getUserByEmail(email: string) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async getAllUsers() {
    return users;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    saveUsers();
    return users[index];
  },

  async deleteUser(userId: string) {
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users.splice(index, 1);
    saveUsers();
  },
};

// Post Service
export const postService = {
  async createPost(post: Post) {
    const newPost = { ...post, id: post.id || generateId('post') };
    posts.push(newPost);
    savePosts();
    return newPost;
  },

  async getPosts() {
    return posts;
  },

  async getPost(postId: string) {
    return posts.find(p => p.id === postId) || null;
  },

  async updatePost(postId: string, updates: Partial<Post>) {
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error('Post not found');
    posts[index] = { ...posts[index], ...updates };
    savePosts();
    return posts[index];
  },

  async deletePost(postId: string) {
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error('Post not found');
    posts.splice(index, 1);
    savePosts();
  },
};

// Event Service
export const eventService = {
  async createEvent(event: Event) {
    const newEvent = { ...event, id: event.id || generateId('evt'), attendees: event.attendees || [] };
    events.push(newEvent);
    saveEvents();
    return newEvent;
  },

  async getEvents() {
    return events;
  },

  async getEvent(eventId: string) {
    return events.find(e => e.id === eventId) || null;
  },

  async updateEvent(eventId: string, updates: Partial<Event>) {
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');
    events[index] = { ...events[index], ...updates };
    saveEvents();
    return events[index];
  },

  async deleteEvent(eventId: string) {
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');
    events.splice(index, 1);
    saveEvents();
  },

  async registerForEvent(eventId: string, userId: string) {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    
    if (!event.attendees) event.attendees = [];
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      saveEvents();
    }
    
    // Update user's registered events
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.registeredEvents) user.registeredEvents = [];
      if (!user.registeredEvents.includes(eventId)) {
        user.registeredEvents.push(eventId);
        saveUsers();
      }
    }
  },

  async getEventAttendees(eventId: string) {
    const event = events.find(e => e.id === eventId);
    if (!event || !event.attendees) return [];
    return event.attendees.map(userId => users.find(u => u.id === userId)).filter(Boolean) as User[];
  },
};

// Announcement Service
export const announcementService = {
  async createAnnouncement(announcement: Announcement) {
    const newAnnouncement = { ...announcement, id: announcement.id || generateId('ann') };
    announcements.push(newAnnouncement);
    saveAnnouncements();
    return newAnnouncement;
  },

  async getAnnouncements() {
    return announcements;
  },

  async getAnnouncement(announcementId: string) {
    return announcements.find(a => a.id === announcementId) || null;
  },

  async updateAnnouncement(announcementId: string, updates: Partial<Announcement>) {
    const index = announcements.findIndex(a => a.id === announcementId);
    if (index === -1) throw new Error('Announcement not found');
    announcements[index] = { ...announcements[index], ...updates };
    saveAnnouncements();
    return announcements[index];
  },

  async deleteAnnouncement(announcementId: string) {
    const index = announcements.findIndex(a => a.id === announcementId);
    if (index === -1) throw new Error('Announcement not found');
    announcements.splice(index, 1);
    saveAnnouncements();
  },
};

// Notification Service
export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: generateId('notif'),
      timestamp: new Date(),
      read: false,
    };
    notifications.push(newNotification);
    saveNotifications();
    return newNotification;
  },

  async getNotifications(userId: string) {
    return notifications.filter(n => n.userId === userId);
  },

  async markNotificationAsRead(notificationId: string) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      saveNotifications();
    }
  },

  async markAllNotificationsAsRead(userId: string) {
    notifications.filter(n => n.userId === userId && !n.read).forEach(n => {
      n.read = true;
    });
    saveNotifications();
  },

  async deleteNotification(notificationId: string) {
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications.splice(index, 1);
      saveNotifications();
    }
  },
};

// Invitation Service
const invitationCodes = storage.get<Array<{
  code: string;
  maxUses: number;
  currentUses: number;
  expiresAt: Date | null;
  isActive: boolean;
}>>(STORAGE_KEYS.invitationCodes, [
  { code: 'WELCOME2025', maxUses: 100, currentUses: 0, expiresAt: null, isActive: true },
  { code: 'VIP2025', maxUses: 50, currentUses: 0, expiresAt: null, isActive: true },
]);

const saveInvitationCodes = () => storage.set(STORAGE_KEYS.invitationCodes, invitationCodes);

export const invitationService = {
  async validateInvitationCode(code: string) {
    const invitation = invitationCodes.find(ic => ic.code === code && ic.isActive);
    if (!invitation) return false;
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) return false;
    if (invitation.currentUses >= invitation.maxUses) return false;
    return true;
  },

  async useInvitationCode(code: string) {
    const invitation = invitationCodes.find(ic => ic.code === code);
    if (!invitation) throw new Error('Invitation code not found');
    invitation.currentUses++;
    saveInvitationCodes();
  },

  async generateInvitationCode(maxUses: number, expiresAt: Date | null, customCode?: string) {
    const code = customCode || `RENDEZVOUS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    invitationCodes.push({ code, maxUses, currentUses: 0, expiresAt, isActive: true });
    saveInvitationCodes();
    return code;
  },

  async getAllInvitationCodes() {
    return invitationCodes;
  },

  async getInvitationCode(code: string) {
    return invitationCodes.find(ic => ic.code === code) || null;
  },

  async updateInvitationCode(code: string, updates: Partial<typeof invitationCodes[0]>) {
    const invitation = invitationCodes.find(ic => ic.code === code);
    if (!invitation) throw new Error('Invitation code not found');
    Object.assign(invitation, updates);
    saveInvitationCodes();
    return invitation;
  },
};

// Admin Service
export const adminService = {
  async deleteUser(userId: string) {
    return userService.deleteUser(userId);
  },

  async deletePost(postId: string) {
    return postService.deletePost(postId);
  },

  async deleteEvent(eventId: string) {
    return eventService.deleteEvent(eventId);
  },

  async deleteAnnouncement(announcementId: string) {
    return announcementService.deleteAnnouncement(announcementId);
  },
};

// Export data getters for direct access (for AppContext)
export const getLocalData = () => ({ users, posts, events, announcements, notifications });
export const setLocalData = (data: { users?: User[], posts?: Post[], events?: Event[], announcements?: Announcement[], notifications?: Notification[] }) => {
  if (data.users) { users = data.users; saveUsers(); }
  if (data.posts) { posts = data.posts; savePosts(); }
  if (data.events) { events = data.events; saveEvents(); }
  if (data.announcements) { announcements = data.announcements; saveAnnouncements(); }
  if (data.notifications) { notifications = data.notifications; saveNotifications(); }
};

