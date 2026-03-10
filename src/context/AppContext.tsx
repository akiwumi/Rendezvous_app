import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Event, Notification, Announcement } from '../types';
// Local data service replaces Supabase
import { authService, userService, postService, eventService, notificationService, invitationService, adminService, storageService } from '../services/localDataService';

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
  updateUser: (userId: string, updates: Partial<User>) => Promise<User>;
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
        // Load user data
        try {
          const userData = await userService.getUser(user.id);
          if (userData) {
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
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
      // Validate invitation code
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
        // If auth fails, registration fails
        console.error('Authentication failed');
        return false;
      }

      // Create user profile
      if (authData?.user) {
        let profileImageUrl = userData.profileImage || '';
        // If profile image is a data URL (from registration form), upload to Supabase storage
        if (userData.profileImage && userData.profileImage.startsWith('data:')) {
          try {
            const blob = await fetch(userData.profileImage).then((r) => r.blob());
            const ext = blob.type.split('/')[1] || 'png';
            const file = new File([blob], `avatar.${ext}`, { type: blob.type });
            profileImageUrl = await storageService.uploadAvatar(file, authData.user.id);
          } catch (uploadError) {
            console.error('Profile image upload failed:', uploadError);
            profileImageUrl = '';
          }
        }
        const newUser: User = {
          id: authData.user.id,
          fullName: userData.fullName!,
          email: userData.email!,
          phone: userData.phone!,
          address: userData.address,
          socialLinks: userData.socialLinks,
          profileImage: profileImageUrl,
          friends: [],
        };

        try {
          const createdUser = await userService.createUser(newUser);
          // Set current user immediately so profile page can access it
          setCurrentUser(createdUser);
          // Persist full session
          localStorage.setItem('rendezvous_current_user', JSON.stringify(createdUser));
          
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
          // Still set user locally even if save fails
          setCurrentUser(newUser);
          localStorage.setItem('rendezvous_current_user', JSON.stringify(newUser));
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
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      
      // Authenticate with local service
      const authData = await authService.signIn(email, password);
      
      if (authData?.user) {
        const authUser = authData.user;
        console.log('✓ Auth successful for user:', authUser.email, 'ID:', authUser.id);
        
        // Try to load user data
        let userData = await userService.getUser(authUser.id);
        
        // If user profile doesn't exist, create it
        if (!userData) {
          console.log('⚠ User profile not found, creating new profile...');
          
          // Get user metadata from auth
          const userMetadata = authUser.user_metadata || {};

          // Create basic user profile — isAdmin is set only via the database
          const newUser: User = {
            id: authUser.id,
            email: authUser.email || email,
            fullName: userMetadata.full_name || email.split('@')[0],
            phone: userMetadata.phone || '',
            address: userMetadata.address || '',
            profileImage: '',
            socialLinks: {},
            friends: [],
            likedPosts: [],
            registeredEvents: [],
            isAdmin: false,
          };
          
          console.log('Creating user profile with data:', {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            isAdmin: newUser.isAdmin
          });
          
          try {
            userData = await userService.createUser(newUser);
            console.log('✓ User profile created successfully:', userData.email, 'Admin:', userData.isAdmin);
          } catch (createError: any) {
            console.error('✗ Error creating user profile:', createError);
            throw new Error(`Failed to create user profile: ${createError.message}`);
          }
        } else {
          console.log('✓ User profile loaded successfully:', userData.email, 'Admin:', userData.isAdmin);
        }
        
        if (userData) {
          setCurrentUser(userData);
          // Persist full session
          localStorage.setItem('rendezvous_current_user', JSON.stringify(userData));
          console.log('✓ Current user set in context');
          
          // Load user notifications
          try {
            const userNotifications = await notificationService.getNotifications(authUser.id);
            if (userNotifications) {
              setNotifications(userNotifications);
            }
          } catch (notifError) {
            console.error('Error loading notifications:', notifError);
            // Don't fail login if notifications fail to load
          }
          
          console.log('=== LOGIN SUCCESS ===');
          return true;
        }
        
        console.log('✗ No user data available');
        return false;
      }

      console.log('✗ No user in auth response');
      return false;
    } catch (error: any) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error details:', error);
      
      throw new Error('Incorrect email or password. Please try again.');
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
      
      // Update currentUser if it's the logged-in user and refresh session
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
        localStorage.setItem('rendezvous_current_user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const addPost = async (post: Post) => {
    try {
      // Save to local storage
      const savedPost = await postService.createPost(post);
      setPosts([savedPost, ...posts]);
      
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
      // Save to local storage if user is logged in
      if (currentUser) {
        await notificationService.createNotification({
          ...notification,
          userId: currentUser.id,
        });
        setNotifications([...notifications, newNotification]);
      }
    } catch (error) {
      console.error('Error saving notification:', error);
      setNotifications([...notifications, newNotification]);
    }
    
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
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
        await notificationService.markAllNotificationsAsRead(currentUser.id);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const registerForEvent = async (eventId: string, userId: string) => {
    try {
      // Register for event
      await eventService.registerForEvent(eventId, userId);
      
      // Reload event with updated attendees
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
      if (updatedEvent) {
        setEvents(events.map(event => {
          if (event.id === eventId) {
            // Create notification for event registration
            if (currentUser) {
              addNotification({
                type: 'event',
                title: 'Event Registration',
                message: `You registered for ${updatedEvent.title}`,
                relatedItemId: eventId,
              });
            }
            return updatedEvent;
          }
          return event;
        }));
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      // Fallback to local state update
      setEvents(events.map(event => {
        if (event.id === eventId) {
          const attendees = event.attendees || [];
          if (!attendees.includes(userId)) {
            return { ...event, attendees: [...attendees, userId] };
          }
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

