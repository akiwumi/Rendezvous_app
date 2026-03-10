/**
 * Supabase Data Service
 * All data operations backed by Supabase (DB + Auth).
 * Notifications have no DB table yet — stored in localStorage only.
 */

import { User, Post, Comment, Event, Notification, Announcement, Advertisement, AdminMessage } from '../types';
import { supabase } from '../lib/supabase';

// ─── Mappers: DB row (snake_case) → TypeScript type (camelCase) ───────────────

const mapUser = (row: any): User => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone || '',
  address: row.address || '',
  bio: row.bio || '',
  profileImage: row.profile_image || '',
  coverImage: row.cover_image || '',
  socialLinks: row.social_links || {},
  friends: row.friends || [],
  isAdmin: row.is_admin || false,
  likedPosts: row.liked_posts || [],
  registeredEvents: row.registered_events || [],
  createdAt: row.created_at ? new Date(row.created_at) : undefined,
});

const mapComment = (row: any): Comment => ({
  id: row.id,
  authorId: row.author_id,
  authorName: row.author_name,
  authorImage: row.author_image || '',
  content: row.content,
  createdAt: new Date(row.created_at),
});

const mapPost = (row: any): Post => ({
  id: row.id,
  authorId: row.author_id,
  authorName: row.author_name,
  authorImage: row.author_image || '',
  headline: row.headline || '',
  content: row.content,
  image: row.image || '',
  link: row.link || '',
  postType: row.post_type || 'regular',
  eventDate: row.event_date ? new Date(row.event_date) : undefined,
  deadline: row.deadline ? new Date(row.deadline) : undefined,
  location: row.location || '',
  interestedUsers: row.interested_users || [],
  isPaid: row.is_paid || false,
  ticketPrice: row.ticket_price ?? undefined,
  ticketCurrency: row.ticket_currency || 'GBP',
  paymentType: row.payment_type || 'free',
  createdAt: new Date(row.created_at),
  likes: row.likes || [],
  comments: (row.comments || []).map(mapComment),
});

const mapEvent = (row: any): Event => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  image: row.image || '',
  date: new Date(row.date),
  location: row.location || '',
  attendees: row.attendees || [],
  maxAttendees: row.max_attendees ?? undefined,
  createdBy: row.created_by || '',
});

const mapAnnouncement = (row: any): Announcement => ({
  id: row.id,
  title: row.title,
  content: row.content,
  image: row.image || '',
  link: row.link || '',
  date: new Date(row.date || row.created_at),
  type: row.type || 'other',
});

const mapAd = (row: any): Advertisement => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  advertiserName: row.advertiser_name,
  advertiserUrl: row.advertiser_url,
  mediaType: row.media_type,
  mediaUrl: row.media_url,
  thumbnailUrl: row.thumbnail_url || '',
  allowFullscreen: row.allow_fullscreen || false,
  startDate: new Date(row.start_date),
  endDate: new Date(row.end_date),
  frequency: row.frequency || 3,
  isActive: row.is_active || false,
  impressions: row.impressions || 0,
  clicks: row.clicks || 0,
  paymentStatus: row.payment_status || 'pending',
  paymentAmount: row.payment_amount || 0,
  createdAt: new Date(row.created_at),
  createdBy: row.created_by || '',
});

const mapAdminMessage = (row: any): AdminMessage => ({
  id: row.id,
  adminId: row.admin_id,
  userId: row.user_id,
  senderId: row.sender_id,
  senderName: row.sender_name,
  content: row.content,
  timestamp: new Date(row.timestamp),
  read: row.read || false,
});

const mapInvitationCode = (row: any) => ({
  code: row.code,
  maxUses: row.max_uses,
  currentUses: row.used_count,
  expiresAt: row.expires_at ? new Date(row.expires_at) : null,
  isActive: row.is_active,
});

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  async signUp(email: string, password: string, _userData: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/welcome`,
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    localStorage.removeItem('rendezvous_current_user');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
  },

  onAuthStateChange(callback: (user: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return { data };
  },
};

// ─── User Service ─────────────────────────────────────────────────────────────

export const userService = {
  async createUser(userData: User) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
        bio: userData.bio || '',
        profile_image: userData.profileImage || '',
        cover_image: userData.coverImage || '',
        social_links: userData.socialLinks || {},
        friends: userData.friends || [],
        is_admin: userData.isAdmin || false,
        liked_posts: userData.likedPosts || [],
        registered_events: userData.registeredEvents || [],
      })
      .select()
      .single();
    if (error) throw error;
    return mapUser(data);
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapUser(data) : null;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) throw error;
    return data ? mapUser(data) : null;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapUser);
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.profileImage !== undefined) dbUpdates.profile_image = updates.profileImage;
    if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
    if (updates.socialLinks !== undefined) dbUpdates.social_links = updates.socialLinks;
    if (updates.friends !== undefined) dbUpdates.friends = updates.friends;
    if (updates.isAdmin !== undefined) dbUpdates.is_admin = updates.isAdmin;
    if (updates.likedPosts !== undefined) dbUpdates.liked_posts = updates.likedPosts;
    if (updates.registeredEvents !== undefined) dbUpdates.registered_events = updates.registeredEvents;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return mapUser(data);
  },

  async deleteUser(userId: string) {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) throw error;
  },

  async addFriend(userId: string, friendId: string) {
    const [userRes, friendRes] = await Promise.all([
      supabase.from('users').select('friends').eq('id', userId).single(),
      supabase.from('users').select('friends').eq('id', friendId).single(),
    ]);
    if (userRes.error) throw userRes.error;
    if (friendRes.error) throw friendRes.error;

    const userFriends: string[] = userRes.data.friends || [];
    const friendFriends: string[] = friendRes.data.friends || [];
    if (!userFriends.includes(friendId)) userFriends.push(friendId);
    if (!friendFriends.includes(userId)) friendFriends.push(userId);

    await Promise.all([
      supabase.from('users').update({ friends: userFriends }).eq('id', userId),
      supabase.from('users').update({ friends: friendFriends }).eq('id', friendId),
    ]);
    return this.getUser(userId) as Promise<User>;
  },

  async removeFriend(userId: string, friendId: string) {
    const [userRes, friendRes] = await Promise.all([
      supabase.from('users').select('friends').eq('id', userId).single(),
      supabase.from('users').select('friends').eq('id', friendId).maybeSingle(),
    ]);
    if (userRes.error) throw userRes.error;

    const userFriends = (userRes.data.friends || []).filter((id: string) => id !== friendId);
    await supabase.from('users').update({ friends: userFriends }).eq('id', userId);

    if (friendRes.data) {
      const friendFriends = (friendRes.data.friends || []).filter((id: string) => id !== userId);
      await supabase.from('users').update({ friends: friendFriends }).eq('id', friendId);
    }
    return this.getUser(userId) as Promise<User>;
  },
};

// ─── Post Service ─────────────────────────────────────────────────────────────

export const postService = {
  async createPost(post: Post) {
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert({
        author_id: post.authorId,
        author_name: post.authorName,
        author_image: post.authorImage || '',
        headline: post.headline || '',
        content: post.content,
        image: post.image || '',
        link: post.link || '',
        post_type: post.postType || 'regular',
        event_date: post.eventDate || null,
        deadline: post.deadline || null,
        location: post.location || '',
        interested_users: post.interestedUsers || [],
        is_paid: post.isPaid || false,
        ticket_price: post.ticketPrice ?? null,
        ticket_currency: post.ticketCurrency || 'GBP',
        payment_type: post.paymentType || 'free',
        likes: post.likes || [],
      })
      .select()
      .single();
    if (postError) throw postError;

    if (post.comments && post.comments.length > 0) {
      await supabase.from('comments').insert(
        post.comments.map(c => ({
          post_id: postData.id,
          author_id: c.authorId,
          author_name: c.authorName,
          author_image: c.authorImage || '',
          content: c.content,
        }))
      );
    }

    return mapPost({ ...postData, comments: post.comments || [] });
  },

  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapPost);
  },

  async getPost(postId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .eq('id', postId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapPost(data) : null;
  },

  async updatePost(postId: string, updates: Partial<Post>) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.headline !== undefined) dbUpdates.headline = updates.headline;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.link !== undefined) dbUpdates.link = updates.link;
    if (updates.likes !== undefined) dbUpdates.likes = updates.likes;
    if (updates.interestedUsers !== undefined) dbUpdates.interested_users = updates.interestedUsers;
    if (updates.eventDate !== undefined) dbUpdates.event_date = updates.eventDate;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.location !== undefined) dbUpdates.location = updates.location;

    const { data, error } = await supabase
      .from('posts')
      .update(dbUpdates)
      .eq('id', postId)
      .select('*, comments(*)')
      .single();
    if (error) throw error;
    return mapPost(data);
  },

  async deletePost(postId: string) {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) throw error;
  },
};

// ─── Event Service ────────────────────────────────────────────────────────────

export const eventService = {
  async createEvent(event: Event) {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: event.title,
        description: event.description,
        image: event.image || '',
        date: event.date,
        location: event.location || '',
        attendees: event.attendees || [],
        max_attendees: event.maxAttendees ?? null,
        created_by: event.createdBy,
      })
      .select()
      .single();
    if (error) throw error;
    return mapEvent(data);
  },

  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapEvent);
  },

  async getEvent(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapEvent(data) : null;
  },

  async updateEvent(eventId: string, updates: Partial<Event>) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.attendees !== undefined) dbUpdates.attendees = updates.attendees;
    if (updates.maxAttendees !== undefined) dbUpdates.max_attendees = updates.maxAttendees;

    const { data, error } = await supabase
      .from('events')
      .update(dbUpdates)
      .eq('id', eventId)
      .select()
      .single();
    if (error) throw error;
    return mapEvent(data);
  },

  async deleteEvent(eventId: string) {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) throw error;
  },

  async registerForEvent(eventId: string, userId: string) {
    const { data: eventData, error: fetchError } = await supabase
      .from('events')
      .select('attendees')
      .eq('id', eventId)
      .single();
    if (fetchError) throw fetchError;

    const attendees: string[] = eventData.attendees || [];
    if (!attendees.includes(userId)) {
      attendees.push(userId);
      const { error } = await supabase.from('events').update({ attendees }).eq('id', eventId);
      if (error) throw error;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('registered_events')
      .eq('id', userId)
      .single();
    if (userData) {
      const registeredEvents: string[] = userData.registered_events || [];
      if (!registeredEvents.includes(eventId)) {
        registeredEvents.push(eventId);
        await supabase.from('users').update({ registered_events: registeredEvents }).eq('id', userId);
      }
    }
  },

  async getEventAttendees(eventId: string) {
    const { data: eventData, error } = await supabase
      .from('events')
      .select('attendees')
      .eq('id', eventId)
      .single();
    if (error) throw error;
    const attendeeIds: string[] = eventData.attendees || [];
    if (attendeeIds.length === 0) return [];
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('id', attendeeIds);
    if (usersError) throw usersError;
    return (usersData || []).map(mapUser);
  },
};

// ─── Announcement Service ─────────────────────────────────────────────────────

export const announcementService = {
  async createAnnouncement(announcement: Announcement) {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title: announcement.title,
        content: announcement.content,
        image: announcement.image || '',
        link: announcement.link || '',
        date: announcement.date,
        type: announcement.type || 'other',
      })
      .select()
      .single();
    if (error) throw error;
    return mapAnnouncement(data);
  },

  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapAnnouncement);
  },

  async getAnnouncement(announcementId: string) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapAnnouncement(data) : null;
  },

  async updateAnnouncement(announcementId: string, updates: Partial<Announcement>) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.link !== undefined) dbUpdates.link = updates.link;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.type !== undefined) dbUpdates.type = updates.type;

    const { data, error } = await supabase
      .from('announcements')
      .update(dbUpdates)
      .eq('id', announcementId)
      .select()
      .single();
    if (error) throw error;
    return mapAnnouncement(data);
  },

  async deleteAnnouncement(announcementId: string) {
    const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
    if (error) throw error;
  },
};

// ─── Notification Service (localStorage only — no DB table) ──────────────────

const NOTIF_KEY = 'rendezvous_notifications';

const loadNotifications = (): Notification[] => {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveNotificationsToStorage = (notifications: Notification[]) => {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications)); } catch { /* noop */ }
};

export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const all = loadNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: new Date(),
      read: false,
    };
    all.push(newNotification);
    saveNotificationsToStorage(all);
    return newNotification;
  },

  async getNotifications(userId: string) {
    return loadNotifications().filter(n => n.userId === userId);
  },

  async markNotificationAsRead(notificationId: string) {
    saveNotificationsToStorage(
      loadNotifications().map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  },

  async markAllNotificationsAsRead(userId: string) {
    saveNotificationsToStorage(
      loadNotifications().map(n => n.userId === userId ? { ...n, read: true } : n)
    );
  },

  async deleteNotification(notificationId: string) {
    saveNotificationsToStorage(loadNotifications().filter(n => n.id !== notificationId));
  },
};

// ─── Invitation Service ───────────────────────────────────────────────────────

export const invitationService = {
  async validateInvitationCode(code: string) {
    const { data, error } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();
    if (error || !data) return false;
    if (data.expires_at && new Date(data.expires_at) < new Date()) return false;
    if (data.used_count >= data.max_uses) return false;
    return true;
  },

  async useInvitationCode(code: string) {
    const { data, error } = await supabase
      .from('invitation_codes')
      .select('used_count')
      .eq('code', code)
      .single();
    if (error) throw error;
    const { error: updateError } = await supabase
      .from('invitation_codes')
      .update({ used_count: (data.used_count || 0) + 1 })
      .eq('code', code);
    if (updateError) throw updateError;
  },

  async generateInvitationCode(maxUses: number, expiresAt: Date | null, customCode?: string) {
    const code = customCode || `RENDEZVOUS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const { error } = await supabase
      .from('invitation_codes')
      .insert({ code, max_uses: maxUses, used_count: 0, expires_at: expiresAt, is_active: true });
    if (error) throw error;
    return code;
  },

  async getAllInvitationCodes() {
    const { data, error } = await supabase
      .from('invitation_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapInvitationCode);
  },

  async getInvitationCode(code: string) {
    const { data, error } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .maybeSingle();
    if (error) throw error;
    return data ? mapInvitationCode(data) : null;
  },

  async updateInvitationCode(code: string, updates: { isActive?: boolean; maxUses?: number }) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.maxUses !== undefined) dbUpdates.max_uses = updates.maxUses;

    const { data, error } = await supabase
      .from('invitation_codes')
      .update(dbUpdates)
      .eq('code', code)
      .select()
      .single();
    if (error) throw error;
    return mapInvitationCode(data);
  },
};

// ─── Admin Service ────────────────────────────────────────────────────────────

export const adminService = {
  async deleteUser(userId: string) { return userService.deleteUser(userId); },
  async deletePost(postId: string) { return postService.deletePost(postId); },
  async deleteEvent(eventId: string) { return eventService.deleteEvent(eventId); },
  async deleteAnnouncement(announcementId: string) { return announcementService.deleteAnnouncement(announcementId); },
};

// ─── Advertisement Service ────────────────────────────────────────────────────

export const advertisementService = {
  async getAll(): Promise<Advertisement[]> {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapAd);
  },

  async getActive(): Promise<Advertisement[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now);
    if (error) throw error;
    return (data || []).map(mapAd);
  },

  async create(ad: Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt'>): Promise<Advertisement> {
    const { data, error } = await supabase
      .from('advertisements')
      .insert({
        title: ad.title,
        description: ad.description || '',
        advertiser_name: ad.advertiserName,
        advertiser_url: ad.advertiserUrl,
        media_type: ad.mediaType,
        media_url: ad.mediaUrl,
        thumbnail_url: ad.thumbnailUrl || '',
        allow_fullscreen: ad.allowFullscreen,
        start_date: ad.startDate,
        end_date: ad.endDate,
        frequency: ad.frequency,
        is_active: ad.isActive,
        payment_status: ad.paymentStatus,
        payment_amount: ad.paymentAmount,
        created_by: ad.createdBy,
      })
      .select()
      .single();
    if (error) throw error;
    return mapAd(data);
  },

  async update(id: string, updates: Partial<Advertisement>): Promise<Advertisement> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency;
    if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
    if (updates.impressions !== undefined) dbUpdates.impressions = updates.impressions;
    if (updates.clicks !== undefined) dbUpdates.clicks = updates.clicks;

    const { data, error } = await supabase
      .from('advertisements')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapAd(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('advertisements').delete().eq('id', id);
    if (error) throw error;
  },

  async trackImpression(id: string): Promise<void> {
    const { data } = await supabase.from('advertisements').select('impressions').eq('id', id).single();
    if (data) await supabase.from('advertisements').update({ impressions: (data.impressions || 0) + 1 }).eq('id', id);
  },

  async trackClick(id: string): Promise<void> {
    const { data } = await supabase.from('advertisements').select('clicks').eq('id', id).single();
    if (data) await supabase.from('advertisements').update({ clicks: (data.clicks || 0) + 1 }).eq('id', id);
  },
};

// ─── Admin Message Service ────────────────────────────────────────────────────

export const adminMessageService = {
  async getThreads(adminId: string): Promise<{ userId: string; lastMessage: AdminMessage; unread: number }[]> {
    const { data, error } = await supabase
      .from('admin_messages')
      .select('*')
      .eq('admin_id', adminId)
      .order('timestamp', { ascending: false });
    if (error) throw error;

    const userMap = new Map<string, AdminMessage[]>();
    (data || []).forEach((row: any) => {
      const msg = mapAdminMessage(row);
      if (!userMap.has(msg.userId)) userMap.set(msg.userId, []);
      userMap.get(msg.userId)!.push(msg);
    });

    return Array.from(userMap.entries()).map(([userId, messages]) => ({
      userId,
      lastMessage: messages[0],
      unread: messages.filter(m => !m.read && m.senderId !== adminId).length,
    }));
  },

  async getThread(adminId: string, userId: string): Promise<AdminMessage[]> {
    const { data, error } = await supabase
      .from('admin_messages')
      .select('*')
      .eq('admin_id', adminId)
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapAdminMessage);
  },

  async send(msg: Omit<AdminMessage, 'id' | 'timestamp' | 'read'>): Promise<AdminMessage> {
    const { data, error } = await supabase
      .from('admin_messages')
      .insert({
        admin_id: msg.adminId,
        user_id: msg.userId,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        content: msg.content,
        read: false,
      })
      .select()
      .single();
    if (error) throw error;
    return mapAdminMessage(data);
  },

  async markRead(adminId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_messages')
      .update({ read: true })
      .eq('admin_id', adminId)
      .eq('user_id', userId)
      .neq('sender_id', adminId);
    if (error) throw error;
  },
};

// ─── Storage Service ──────────────────────────────────────────────────────────

const BUCKETS = {
  avatars: 'avatars',
  postMedia: 'post-media',
  chatAttachments: 'chat-attachments',
} as const;

const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
};

export const storageService = {
  async uploadAvatar(file: File, userId: string): Promise<string> {
    const ext = file.name.split('.').pop();
    return uploadFile(BUCKETS.avatars, `${userId}/avatar.${ext}`, file);
  },

  async uploadCover(file: File, userId: string): Promise<string> {
    const ext = file.name.split('.').pop();
    return uploadFile(BUCKETS.avatars, `${userId}/cover.${ext}`, file);
  },

  async uploadPostMedia(file: File, userId: string): Promise<string> {
    const ext = file.name.split('.').pop();
    const name = `${userId}/${Date.now()}.${ext}`;
    return uploadFile(BUCKETS.postMedia, name, file);
  },

  async uploadChatAttachment(file: File, userId: string): Promise<string> {
    const name = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    return uploadFile(BUCKETS.chatAttachments, name, file);
  },

  getAttachmentType(file: File): 'image' | 'video' | 'file' {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  },

  isVideoUrl(url: string): boolean {
    return /\.(mp4|mov|webm|ogg|avi)(\?|$)/i.test(url);
  },
};

// ─── Legacy compatibility exports ────────────────────────────────────────────
export const getLocalData = () => ({ users: [], posts: [], events: [], announcements: [], notifications: [] });
export const setLocalData = (_data: unknown) => {};
