import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Post, Event } from '../types';
import { adminUser, dummyEvents } from '../data/dummyData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
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
      // Create a demo user
      const demoUser: User = {
        id: 'demo-user-1',
        fullName: 'Demo User',
        email: 'demo@rendezvous.club',
        phone: '+34 123 456 789',
        address: 'Mallorca, Spain',
        friends: [adminUser.id],
        profileImage: undefined,
      };
      setCurrentUser(demoUser);
      return true;
    }
    return false;
  };

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  const registerForEvent = (eventId: string, userId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId && !event.attendees.includes(userId)) {
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

