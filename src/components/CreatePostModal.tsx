import { useState } from 'react';
import { Post } from '../types';
import './CreatePostModal.css';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Partial<Post>) => void;
  currentUser: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, currentUser }: CreatePostModalProps) => {
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'event' | 'announcement' | 'regular'>('regular');
  const [image, setImage] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter post content');
      return;
    }

    const postData: Partial<Post> = {
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorImage: currentUser.profileImage,
      headline: headline.trim() || undefined,
      content: content.trim(),
      image: image || undefined,
      postType: postType,
      location: location.trim() || undefined,
      interestedUsers: [],
      likes: [],
      comments: [],
    };

    // Combine date and time for eventDate
    if (eventDate && eventTime) {
      postData.eventDate = new Date(`${eventDate}T${eventTime}`);
    } else if (eventDate) {
      postData.eventDate = new Date(eventDate);
    }

    // Combine date and time for deadline
    if (deadline && deadlineTime) {
      postData.deadline = new Date(`${deadline}T${deadlineTime}`);
    } else if (deadline) {
      postData.deadline = new Date(deadline);
    }

    onSubmit(postData);
    
    // Reset form
    setHeadline('');
    setContent('');
    setPostType('regular');
    setImage(null);
    setEventDate('');
    setEventTime('');
    setDeadline('');
    setDeadlineTime('');
    setLocation('');
    onClose();
  };

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  const commonEmojis = ['😊', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🎯', '🌟', '💪', '🎊', '🙌', '👏', '🥳', '🎈'];

  return (
    <div className="create-post-modal-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Post Type Selection */}
          <div className="form-group">
            <label>Post Type</label>
            <div className="post-type-buttons">
              <button
                className={`type-btn ${postType === 'regular' ? 'active' : ''}`}
                onClick={() => setPostType('regular')}
              >
                Regular Post
              </button>
              <button
                className={`type-btn ${postType === 'event' ? 'active' : ''}`}
                onClick={() => setPostType('event')}
              >
                Event
              </button>
              <button
                className={`type-btn ${postType === 'announcement' ? 'active' : ''}`}
                onClick={() => setPostType('announcement')}
              >
                Announcement
              </button>
            </div>
          </div>

          {/* Headline */}
          <div className="form-group">
            <label>Headline</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter post headline..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label>Content</label>
            <textarea
              className="form-textarea"
              placeholder="What's on your mind? Use emojis! 😊"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
            {/* Emoji Picker */}
            <div className="emoji-picker">
              <span className="emoji-label">Quick emojis:</span>
              <div className="emoji-buttons">
                {commonEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    className="emoji-btn"
                    onClick={() => insertEmoji(emoji)}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Image</label>
            <div className="image-upload-section">
              {image && (
                <div className="image-preview">
                  <img src={image} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => setImage(null)}
                  >
                    ×
                  </button>
                </div>
              )}
              <label className="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                📷 Upload Image
              </label>
            </div>
          </div>

          {/* Event/Announcement Specific Fields */}
          {(postType === 'event' || postType === 'announcement') && (
            <>
              {/* Date and Time */}
              <div className="form-group">
                <label>Date & Time</label>
                <div className="date-time-row">
                  <input
                    type="date"
                    className="form-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="form-input"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Deadline */}
              <div className="form-group">
                <label>Registration Deadline</label>
                <div className="date-time-row">
                  <input
                    type="date"
                    className="form-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  <input
                    type="time"
                    className="form-input"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

