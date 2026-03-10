import { User } from '../types';

// Admin User — Eugene Akiwumi (Pebbles)
export const adminUser: User = {
  id: 'admin-1',
  fullName: 'Eugene Akiwumi',
  email: 'akiwumi@gmail.com',
  phone: '',
  address: 'Palma de Mallorca, Spain',
  profileImage: '/pebbles.jpg',
  friends: [],
  isAdmin: true,
  socialLinks: {
    instagram: '@pebbles_rendezvous',
    facebook: 'eugene.akiwumi',
    twitter: '@PebblesRSC',
    linkedin: 'eugene-akiwumi',
  },
  likedPosts: [],
  registeredEvents: [],
};

// Admin profile static content shown on the admin profile page
export const adminProfile = {
  bio: `Founder and Director of Rendezvous Social Club, Eugene Akiwumi (known as Pebbles) has been the heart and soul of Mallorca's most exclusive private social club. With extensive experience in luxury hospitality and event management, Eugene brings a unique blend of warmth, professionalism, and Mediterranean charm to every gathering.

Eugene's vision for Rendezvous is to create a space where like-minded individuals can connect, celebrate, and create lasting memories in one of the world's most beautiful destinations.`,

  role: 'Founder & Director',
  memberSince: new Date('2018-03-15'),

  achievements: [
    'Founded Rendezvous Social Club',
    'Organized over 500+ exclusive events',
    'Built a community of 200+ distinguished members',
    'Featured in Mallorca Magazine\'s "Top 10 Influencers"',
    'Recipient of the Palma Hospitality Excellence Award 2023',
  ],

  interests: [
    'Wine & Gastronomy',
    'Yacht Sailing',
    'Contemporary Art',
    'Golf',
    'Travel & Cultural Exchange',
    'Interior Design',
  ],

  languages: ['English', 'Spanish', 'German'],

  quote: '"Life is too short for ordinary experiences. At Rendezvous, we create extraordinary moments that become cherished memories."',

  stats: {
    eventsHosted: 156,
    membersConnected: 248,
    yearsActive: 7,
    countriesRepresented: 28,
  },
};

// Empty arrays — no dummy data
export const dummyUsers: User[] = [];
export const dummyPosts: never[] = [];
export const dummyEvents: never[] = [];
export const dummyAnnouncements: never[] = [];
