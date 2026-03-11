'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Event } from '../types';
import { eventService } from '../services/localDataService';
import AppHeader from '../components/AppHeader';
import PullToRefresh from '../components/PullToRefresh';
import './EventsPage.css';

const EventsPage = () => {
  const { currentUser, events, setEvents, registerForEvent } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    if (events.length === 0) {
      loadEvents();
    }
  }, [events.length, setEvents]);

  const handleRefresh = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleRegisterInterest = (eventId: string) => {
    if (!currentUser) {
      alert('Please register to RSVP for events');
      return;
    }

    registerForEvent(eventId, currentUser.id);
    const event = events.find(e => e.id === eventId);
    if (event) {
      alert(`You've registered your interest for "${event.title}". The admin has been notified.`);
    }
  };

  const isRegistered = (event: Event) => {
    return currentUser ? event.attendees.includes(currentUser.id) : false;
  };

  const handleCalendarClick = (event: Event) => {
    setSelectedEvent(event);
    setShowCalendar(true);
  };

  return (
    <div className="events-page">
      <AppHeader />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="events-content">
        <h1 className="page-title">Upcoming Events</h1>
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              {event.image && (
                <div className={`event-image-container ${event.createdBy === 'admin-1' ? 'has-admin-watermark' : ''}`}>
                  <img src={event.image} alt={event.title} className="event-image" />
                </div>
              )}
              <div className="event-content">
                <h2 className="event-title">{event.title}</h2>
                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="event-icon">📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {event.location && (
                    <div className="event-detail-item">
                      <span className="event-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.maxAttendees && (
                    <div className="event-detail-item">
                      <span className="event-icon">👥</span>
                      <span>
                        {event.attendees.length} / {event.maxAttendees} attending
                      </span>
                    </div>
                  )}
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-actions">
                  <button
                    className={`register-button ${isRegistered(event) ? 'registered' : ''}`}
                    onClick={() => handleRegisterInterest(event.id)}
                  >
                    {isRegistered(event) ? '✓ Registered' : 'Register Interest'}
                  </button>
                  <button
                    className="calendar-button"
                    onClick={() => handleCalendarClick(event)}
                  >
                    📅 Add to Calendar
                  </button>
                </div>
                {event.attendees.length > 0 && (
                  <div className="attendees-section">
                    <h3 className="attendees-title">Attendees ({event.attendees.length})</h3>
                    <div className="attendees-list">
                      {event.attendees.slice(0, 10).map((userId, index) => (
                        <div key={index} className="attendee-avatar">
                          {userId === 'admin-1' ? 'PE' : userId.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {event.attendees.length > 10 && (
                        <div className="attendee-avatar more">
                          +{event.attendees.length - 10}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </PullToRefresh>

      {showCalendar && selectedEvent && (
        <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add to Calendar</h3>
            <p>Event: {selectedEvent.title}</p>
            <p>Date: {formatDate(selectedEvent.date)}</p>
            <p>Location: {selectedEvent.location || 'TBA'}</p>
            <div className="calendar-actions">
              <button
                className="calendar-export-btn"
                onClick={() => {
                  // In a real app, this would generate and download an .ics file
                  alert('Calendar event added! (In production, this would add to your device calendar)');
                  setShowCalendar(false);
                }}
              >
                Add to Calendar
              </button>
              <button
                className="calendar-cancel-btn"
                onClick={() => setShowCalendar(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

