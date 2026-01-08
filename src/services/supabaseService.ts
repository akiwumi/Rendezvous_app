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
    
    // Update last_login timestamp in users table
    if (response.data.user) {
      try {
        await supabase
          .from(TABLES.users)
          .update({ last_login: new Date().toISOString() })
          .eq('id', response.data.user.id);
      } catch (error) {
        console.error('Error updating last_login:', error);
        // Don't fail login if last_login update fails
      }
    }
    
    return response.data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Update last_login if session exists (user opened app while already logged in)
    if (user) {
      try {
        await supabase
          .from(TABLES.users)
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating last_login:', error);
        // Don't fail if last_login update fails
      }
    }
    
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
    
    // Check if code has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false;
    }
    
    // Check if max uses exceeded
    if (data.max_uses && data.current_uses >= data.max_uses) {
      return false;
    }
    
    return true;
  },

  async generateInvitationCode(options?: {
    code?: string;
    maxUses?: number;
    expiresAt?: Date;
    active?: boolean;
  }): Promise<string> {
    // Generate a random code if not provided
    const code = options?.code || this.generateRandomCode();
    
    const { data, error } = await supabase
      .from(TABLES.invitation_codes)
      .insert([{
        code,
        active: options?.active !== false,
        max_uses: options?.maxUses || null,
        current_uses: 0,
        expires_at: options?.expiresAt?.toISOString() || null,
      }])
      .select()
      .single();

    if (error) {
      // If code already exists, try generating a new one
      if (error.code === '23505') { // Unique violation
        return this.generateInvitationCode(options);
      }
      throw error;
    }

    return data.code;
  },

  generateRandomCode(length: number = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars like 0, O, I, 1
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  async getAllInvitationCodes() {
    const { data, error } = await supabase
      .from(TABLES.invitation_codes)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getInvitationCode(code: string) {
    const { data, error } = await supabase
      .from(TABLES.invitation_codes)
      .select('*')
      .eq('code', code)
      .single();

    if (error) throw error;
    return data;
  },

  async updateInvitationCode(code: string, updates: {
    active?: boolean;
    max_uses?: number;
    expires_at?: Date | null;
  }) {
    const updateData: any = {};
    if (updates.active !== undefined) updateData.active = updates.active;
    if (updates.max_uses !== undefined) updateData.max_uses = updates.max_uses;
    if (updates.expires_at !== undefined) {
      updateData.expires_at = updates.expires_at ? updates.expires_at.toISOString() : null;
    }

    const { data, error } = await supabase
      .from(TABLES.invitation_codes)
      .update(updateData)
      .eq('code', code)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async useInvitationCode(code: string) {
    try {
      // Try using RPC function if it exists
      const { data, error } = await supabase.rpc('increment_invitation_code_uses', {
        code_value: code
      });

      if (!error && data) {
        return data;
      }
    } catch (rpcError) {
      console.log('RPC function not available, using manual update');
    }

    // Fallback: manual increment
    const codeData = await this.getInvitationCode(code);
    if (codeData) {
      const newCurrentUses = (codeData.current_uses || 0) + 1;
      const { data, error } = await supabase
        .from(TABLES.invitation_codes)
        .update({ current_uses: newCurrentUses })
        .eq('code', code)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    
    throw new Error('Invitation code not found');
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
  },

  async updateAnnouncement(announcementId: string, updates: any) {
    const { data, error } = await supabase
      .from(TABLES.announcements)
      .update(updates)
      .eq('id', announcementId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(announcementId: string) {
    const { error } = await supabase
      .from(TABLES.announcements)
      .delete()
      .eq('id', announcementId);

    if (error) throw error;
  }
};

// Admin Service - for managing all app aspects
export const adminService = {
  // User Management
  async deleteUser(userId: string) {
    const { error } = await supabase
      .from(TABLES.users)
      .delete()
      .eq('id', userId);

    if (error) throw error;
  },

  async updateUserRole(userId: string, isAdmin: boolean) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .update({ is_admin: isAdmin })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return dbToUser(data);
  },

  // Post Management
  async deletePost(postId: string) {
    await postService.deletePost(postId);
  },

  // Event Management
  async deleteEvent(eventId: string) {
    // First delete attendees
    await supabase
      .from(TABLES.event_attendees)
      .delete()
      .eq('event_id', eventId);

    // Then delete event
    const { error } = await supabase
      .from(TABLES.events)
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  },

  // Announcement Management
  async deleteAnnouncement(announcementId: string) {
    await announcementService.deleteAnnouncement(announcementId);
  }
};

