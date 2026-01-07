import { supabase, TABLES } from '../lib/supabase';
import { User, Post, Event, Notification } from '../types';
import { dbToUser, userToDb, dbToPost, postToDb, dbToEvent, eventToDb, dbToNotification, notificationToDb } from '../utils/dbHelpers';

// Authentication
export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
          address: userData.address,
        }
      }
    });

    if (response.error) throw response.error;
    return response.data;
  },

  async signIn(email: string, password: string) {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) throw response.error;
    return response.data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }
};

// Users
export const userService = {
  async createUser(userData: User) {
    const dbData = userToDb(userData);
    const { data, error } = await supabase
      .from(TABLES.users)
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return dbToUser(data);
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return dbToUser(data);
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return dbToUser(data);
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const dbUpdates = userToDb(updates);
    const { data, error } = await supabase
      .from(TABLES.users)
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return dbToUser(data);
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data.map(dbToUser);
  }
};

// Posts
export const postService = {
  async createPost(post: Post) {
    const dbData = postToDb(post);
    const { data, error } = await supabase
      .from(TABLES.posts)
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return dbToPost(data);
  },

  async getPosts(limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.posts)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(dbToPost);
  },

  async getPost(postId: string) {
    const { data, error } = await supabase
      .from(TABLES.posts)
      .select('*')
      .eq('id', postId)
      .single();

    if (error) throw error;
    return dbToPost(data);
  },

  async updatePost(postId: string, updates: Partial<Post>) {
    const dbUpdates = postToDb(updates);
    const { data, error } = await supabase
      .from(TABLES.posts)
      .update(dbUpdates)
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return dbToPost(data);
  },

  async deletePost(postId: string) {
    const { error } = await supabase
      .from(TABLES.posts)
      .delete()
      .eq('id', postId);

    if (error) throw error;
  }
};

// Events
export const eventService = {
  async createEvent(event: Event) {
    const dbData = eventToDb(event);
    const { data, error } = await supabase
      .from(TABLES.events)
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return dbToEvent(data);
  },

  async getEvents(limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.events)
      .select('*')
      .order('date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    
    // Load attendees for each event
    const eventsWithAttendees = await Promise.all(
      data.map(async (event) => {
        const attendees = await this.getEventAttendees(event.id);
        return dbToEvent({ ...event, attendees });
      })
    );
    
    return eventsWithAttendees;
  },

  async getEvent(eventId: string) {
    const { data, error } = await supabase
      .from(TABLES.events)
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    
    // Load attendees
    const attendees = await this.getEventAttendees(eventId);
    return dbToEvent({ ...data, attendees });
  },

  async registerForEvent(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from(TABLES.event_attendees)
      .insert([{ event_id: eventId, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEventAttendees(eventId: string) {
    const { data, error } = await supabase
      .from(TABLES.event_attendees)
      .select('user_id')
      .eq('event_id', eventId);

    if (error) throw error;
    return data?.map(item => item.user_id) || [];
  }
};

// Notifications
export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { userId: string }) {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };

    const dbData = notificationToDb({ ...newNotification, userId: notification.userId });
    const { data, error } = await supabase
      .from(TABLES.notifications)
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return dbToNotification(data);
  },

  async getNotifications(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.notifications)
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(dbToNotification);
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from(TABLES.notifications)
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return dbToNotification(data);
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from(TABLES.notifications)
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  }
};

// Invitation Codes
export const invitationService = {
  async validateInvitationCode(code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLES.invitation_codes)
      .select('*')
      .eq('code', code)
      .eq('active', true)
      .single();

    if (error || !data) return false;
    return true;
  }
};

// Announcements
export const announcementService = {
  async getAnnouncements(limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.announcements)
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map((ann: any) => ({
      id: ann.id,
      title: ann.title,
      content: ann.content,
      image: ann.image,
      link: ann.link,
      date: new Date(ann.date),
      type: ann.type,
    }));
  },

  async createAnnouncement(announcement: any) {
    const { data, error } = await supabase
      .from(TABLES.announcements)
      .insert([announcement])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

