import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Post, Event, Notification } from '../types';
import { adminUser, dummyEvents } from '../data/dummyData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  registerUser: (userData: Partial<User>, invitationCode: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => boolean;
  addPost: (post: Post) => void;
  registerForEvent: (eventId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([...dummyEvents]);
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

  const registerUser = async (userData: Partial<User>, invitationCode: string): Promise<boolean> => {
    // Validate invitation code (in real app, this would check against a database)
    if (invitationCode !== 'RENDEZVOUS2025') {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName!,
      email: userData.email!,
      phone: userData.phone!,
      address: userData.address,
      socialLinks: userData.socialLinks,
      profileImage: userData.profileImage,
      friends: [adminUser.id], // Auto-add admin as friend
    };

    setCurrentUser(newUser);
    
    // In a real app, this would send a confirmation email
    console.log('Confirmation email sent to:', newUser.email);
    
    return true;
  };

  const loginUser = (email: string, password: string): boolean => {
    // Dummy login - in a real app, this would verify against a database
    if (email === 'demo@rendezvous.club' && password === 'demo123') {
      // Create a demo user with profile image
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
  };

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
    
    // Create notification for new post
    if (currentUser && post.authorId !== currentUser.id) {
      addNotification({
        type: 'post',
        title: 'New Post',
        message: `${post.authorName} shared a new post`,
        relatedUserId: post.authorId,
        relatedUserName: post.authorName,
        relatedUserImage: post.authorImage,
        relatedItemId: post.id,
      });
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const registerForEvent = (eventId: string, userId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId && !event.attendees.includes(userId)) {
        // Create notification for event registration
        const eventData = events.find(e => e.id === eventId);
        if (eventData && currentUser) {
          addNotification({
            type: 'event',
            title: 'Event Registration',
            message: `You registered for ${eventData.title}`,
            relatedItemId: eventId,
          });
        }
        return { ...event, attendees: [...event.attendees, userId] };
      }
      return event;
    }));
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
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        registerUser,
        loginUser,
        addPost,
        registerForEvent,
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

