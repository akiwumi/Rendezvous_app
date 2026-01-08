import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Event, Notification, Announcement } from '../types';
// Admin user will be loaded from database
import { authService, userService, postService, eventService, notificationService, invitationService, announcementService, adminService } from '../services/supabaseService';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  registerUser: (userData: Partial<User>, invitationCode: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  addPost: (post: Post) => Promise<void>;
  registerForEvent: (eventId: string, userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize: Check for existing session and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing auth session
        const user = await authService.getCurrentUser();
        if (user) {
        // Load user data from Supabase
        try {
          const userData = await userService.getUser(user.id);
          if (userData) {
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
        }

        // Load posts from Supabase
        try {
          const supabasePosts = await postService.getPosts();
          if (supabasePosts && supabasePosts.length > 0) {
            setPosts(supabasePosts);
          }
        } catch (error) {
          console.log('Using local posts data');
        }

        // Load events from Supabase
        try {
          const supabaseEvents = await eventService.getEvents();
          if (supabaseEvents && supabaseEvents.length > 0) {
            setEvents(supabaseEvents);
          }
        } catch (error) {
          console.log('Using local events data');
        }

        // Load announcements from Supabase
        try {
          const supabaseAnnouncements = await announcementService.getAnnouncements();
          if (supabaseAnnouncements && supabaseAnnouncements.length > 0) {
            setAnnouncements(supabaseAnnouncements);
          }
        } catch (error) {
          console.log('Using local announcements data');
        }

        // Load notifications if user is logged in
        if (user) {
          try {
            const supabaseNotifications = await notificationService.getNotifications(user.id);
            if (supabaseNotifications && supabaseNotifications.length > 0) {
              setNotifications(supabaseNotifications);
            }
          } catch (error) {
            console.log('Using local notifications data');
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        // Always stop loading, even if there's an error
        setLoading(false);
      }
    };

    initializeApp();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      if (user) {
        try {
          const userData = await userService.getUser(user.id);
          if (userData) {
            setCurrentUser(userData);
            // Load user notifications
            const userNotifications = await notificationService.getNotifications(user.id);
            if (userNotifications) {
              setNotifications(userNotifications);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setCurrentUser(null);
        setNotifications([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const registerUser = async (userData: Partial<User>, invitationCode: string): Promise<boolean> => {
    try {
      // Validate invitation code with Supabase
      const isValidCode = await invitationService.validateInvitationCode(invitationCode);
      if (!isValidCode) {
        return false;
      }

      // Use the invitation code (increment usage count) - skip for fallback code
      if (invitationCode !== 'RENDEZVOUS2025') {
        try {
          await invitationService.useInvitationCode(invitationCode);
        } catch (error) {
          console.error('Error incrementing invitation code usage:', error);
          // Don't fail registration if usage increment fails
        }
      }

      // Create auth user with user-provided password
      const password = userData.password || `TempPass${Date.now()}`;
      let authData;
      try {
        authData = await authService.signUp(
          userData.email!,
          password,
          userData
        );
      } catch (authError: any) {
        console.error('Auth error:', authError);
        // If Supabase auth fails, registration fails
        console.error('Supabase authentication failed');
        return false;
      }

      // Create user profile in Supabase
      if (authData?.user) {
        const newUser: User = {
          id: authData.user.id,
          fullName: userData.fullName!,
          email: userData.email!,
          phone: userData.phone!,
          address: userData.address,
          socialLinks: userData.socialLinks,
          profileImage: userData.profileImage,
          friends: [],
        };

        try {
          const createdUser = await userService.createUser(newUser);
          // Set current user immediately so profile page can access it
          setCurrentUser(createdUser);
          
          // Create welcome notification
          try {
            await addNotification({
              type: 'announcement',
              title: 'Welcome to Rendezvous!',
              message: `Welcome ${userData.fullName}! You're now a member of Rendezvous Social Club.`,
              relatedItemId: createdUser.id,
            });
          } catch (notifError) {
            console.error('Error creating welcome notification:', notifError);
            // Don't fail registration if notification fails
          }
        } catch (error) {
          console.error('Error creating user profile:', error);
          // Still set user locally even if DB save fails
          setCurrentUser(newUser);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      // Authenticate with Supabase
      const authData = await authService.signIn(email, password);
      
      if (authData?.user) {
        // Load user data from Supabase
        try {
          const userData = await userService.getUser(authData.user.id);
          if (userData) {
            setCurrentUser(userData);
            // Load user notifications
            try {
              const userNotifications = await notificationService.getNotifications(authData.user.id);
              if (userNotifications) {
                setNotifications(userNotifications);
              }
            } catch (notifError) {
              console.error('Error loading notifications:', notifError);
              // Don't fail login if notifications fail to load
            }
            return true;
          } else {
            console.error('User data not found in database');
            return false;
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setNotifications([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(userId, updates);
      
      // Update currentUser if it's the logged-in user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const addPost = async (post: Post) => {
    try {
      // Save to Supabase
      const savedPost = await postService.createPost(post);
      
      if (savedPost) {
        setPosts([savedPost, ...posts]);
      } else {
        // Fallback to local state
        setPosts([post, ...posts]);
      }
      
      // Create notification for new post
      if (currentUser && post.authorId !== currentUser.id) {
        await addNotification({
          type: 'post',
          title: 'New Post',
          message: `${post.authorName} shared a new post`,
          relatedUserId: post.authorId,
          relatedUserName: post.authorName,
          relatedUserImage: post.authorImage,
          relatedItemId: post.id,
        });
      }
    } catch (error) {
      console.error('Error adding post:', error);
      // Fallback to local state
      setPosts([post, ...posts]);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    
    try {
      // Save to Supabase if user is logged in
      if (currentUser) {
        await notificationService.createNotification({
          ...notification,
          userId: currentUser.id,
        });
      }
    } catch (error) {
      console.error('Error saving notification:', error);
    }
    
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = async () => {
    if (currentUser) {
      try {
        await notificationService.markAllAsRead(currentUser.id);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const registerForEvent = async (eventId: string, userId: string) => {
    try {
      // Register in Supabase
      await eventService.registerForEvent(eventId, userId);
      
      // Reload event with updated attendees from database
      const updatedEvent = await eventService.getEvent(eventId);
      
      // Update user's registered events array
      if (currentUser && currentUser.id === userId) {
        const currentRegisteredEvents = currentUser.registeredEvents || [];
        if (!currentRegisteredEvents.includes(eventId)) {
          const updatedRegisteredEvents = [...currentRegisteredEvents, eventId];
          try {
            await userService.updateUser(userId, { registeredEvents: updatedRegisteredEvents });
            // Update local currentUser state
            setCurrentUser({ ...currentUser, registeredEvents: updatedRegisteredEvents });
          } catch (error) {
            console.error('Error updating user registered events:', error);
          }
        }
      }
      
      // Update local state
      setEvents(events.map(event => {
        if (event.id === eventId) {
          // Create notification for event registration
          if (currentUser) {
            addNotification({
              type: 'event',
              title: 'Event Registration',
              message: `You registered for ${event.title}`,
              relatedItemId: eventId,
            });
          }
          return updatedEvent;
        }
        return event;
      }));
    } catch (error) {
      console.error('Error registering for event:', error);
      // Fallback to local state update
      setEvents(events.map(event => {
        if (event.id === eventId && !event.attendees.includes(userId)) {
          return { ...event, attendees: [...event.attendees, userId] };
        }
        return event;
      }));
    }
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Admin functions
  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      // Reload users list
      // If deleted user was current user, logout
      if (currentUser && currentUser.id === userId) {
        await logoutUser();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await adminService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await adminService.deleteEvent(eventId);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const deleteAnnouncement = async (announcementId: string) => {
    try {
      await adminService.deleteAnnouncement(announcementId);
      setAnnouncements(announcements.filter(a => a.id !== announcementId));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        posts,
        setPosts,
        events,
        setEvents,
        announcements,
        setAnnouncements,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        registerUser,
        loginUser,
        logoutUser,
        updateUser,
        addPost,
        registerForEvent,
        deleteUser,
        deletePost,
        deleteEvent,
        deleteAnnouncement,
        isSearchOpen,
        openSearch,
        closeSearch,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

