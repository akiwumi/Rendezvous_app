import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Event, Notification, Announcement } from '../types';
import { adminUser } from '../data/dummyData';
import { authService, userService, postService, eventService, notificationService, invitationService, announcementService } from '../services/supabaseService';

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
  addPost: (post: Post) => Promise<void>;
  registerForEvent: (eventId: string, userId: string) => Promise<void>;
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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'announcement',
      title: 'New Announcement',
      message: 'Exclusive Summer Party has been announced!',
      relatedUserId: adminUser.id,
      relatedUserName: adminUser.fullName,
      relatedUserImage: adminUser.profileImage,
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 'notif-2',
      type: 'event',
      title: 'New Event',
      message: 'Wine Tasting Evening has been added to the calendar',
      relatedUserId: adminUser.id,
      relatedUserName: adminUser.fullName,
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
  ]);

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
      if (!isValidCode && invitationCode !== 'RENDEZVOUS2025') {
        return false;
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
        // Fallback to local registration if Supabase fails
        const newUser: User = {
          id: `user-${Date.now()}`,
          fullName: userData.fullName!,
          email: userData.email!,
          phone: userData.phone!,
          address: userData.address,
          socialLinks: userData.socialLinks,
          profileImage: userData.profileImage,
          friends: [adminUser.id],
        };
        setCurrentUser(newUser);
        return true;
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
          friends: [adminUser.id],
        };

        try {
          const createdUser = await userService.createUser(newUser);
          setCurrentUser(createdUser);
          
          // Create welcome notification
          await addNotification({
            type: 'announcement',
            title: 'Welcome to Rendezvous!',
            message: `Welcome ${userData.fullName}! You're now a member of Rendezvous Social Club.`,
            relatedItemId: createdUser.id,
          });
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
      // Try Supabase authentication first
      let authData;
      try {
        authData = await authService.signIn(email, password);
      } catch (authError: any) {
        // If Supabase auth fails, fall through to demo credentials
        authData = null;
      }
      
      if (authData?.user) {
        // Load user data from Supabase
        try {
          const userData = await userService.getUser(authData.user.id);
          if (userData) {
            setCurrentUser(userData);
            // Load user notifications
            const userNotifications = await notificationService.getNotifications(authData.user.id);
            if (userNotifications) {
              setNotifications(userNotifications);
            }
            return true;
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }

      // Fallback to demo credentials for development
      if (email === 'demo@rendezvous.club' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user-1',
          fullName: 'Demo User',
          email: 'demo@rendezvous.club',
          phone: '+34 123 456 789',
          address: 'Mallorca, Spain',
          friends: [adminUser.id],
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
          socialLinks: {
            instagram: '@demo_user',
            linkedin: 'demo-user',
          },
          likedPosts: ['post-1', 'post-2'],
          registeredEvents: ['evt-1', 'evt-2'],
        };
        setCurrentUser(demoUser);
        return true;
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
        addPost,
        registerForEvent,
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

