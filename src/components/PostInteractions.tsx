'use client';

import { useState } from 'react';
import { Post } from '../types';
import './PostInteractions.css';

interface PostInteractionsProps {
  post: Post;
  currentUser: {
    id: string;
    fullName: string;
    profileImage?: string;
  } | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onRegisterInterest: (postId: string) => void;
  onAddToCalendar: (post: Post) => void;
}

const PostInteractions = ({
  post,
  currentUser,
  onLike,
  onComment,
  onRegisterInterest,
  onAddToCalendar,
}: PostInteractionsProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const isInterested = currentUser && post.interestedUsers 
    ? post.interestedUsers.includes(currentUser.id) 
    : false;

  const handleLike = () => {
    if (!currentUser) {
      alert('Please login to like posts');
      return;
    }
    onLike(post.id);
  };

  const handleCommentSubmit = () => {
    if (!currentUser) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;
    
    onComment(post.id, newComment.trim());
    setNewComment('');
    setShowCommentInput(false);
  };

  const handleRegisterInterest = () => {
    if (!currentUser) {
      alert('Please login to register interest');
      return;
    }
    onRegisterInterest(post.id);
  };

  const insertEmoji = (emoji: string) => {
    setNewComment(prev => prev + emoji);
  };

  const commonEmojis = ['😊', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🎯', '🌟', '💪'];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="post-interactions">
      {/* Post Meta Info */}
      {(post.postType === 'event' || post.postType === 'announcement') && post.eventDate && (
        <div className="post-meta-info">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{formatDate(post.eventDate)}</span>
          </div>
          {post.location && (
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <span>{post.location}</span>
            </div>
          )}
          {post.deadline && (
            <div className="meta-item">
              <span className="meta-icon">⏰</span>
              <span>Deadline: {formatDate(post.deadline)}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons - Modern Engagement Bar */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          title="Like"
        >
          <span className="action-icon">
            {isLiked ? '❤️' : '🤍'}
          </span>
          <span>{post.likes.length || 0}</span>
        </button>
        
        <button
          className="action-btn"
          onClick={() => {
            setShowComments(!showComments);
            setShowCommentInput(!showCommentInput);
          }}
          title="Comment"
        >
          <span className="action-icon">💬</span>
          <span>{post.comments.length || 0}</span>
        </button>

        {(post.postType === 'event' || post.postType === 'announcement') && (
          <>
            <button
              className={`action-btn ${isInterested ? 'interested' : ''}`}
              onClick={handleRegisterInterest}
              title="Register Interest"
            >
              <span className="action-icon">{isInterested ? '✓' : '📌'}</span>
              <span>{post.interestedUsers?.length || 0}</span>
            </button>
            
            <button
              className="action-btn"
              onClick={() => onAddToCalendar(post)}
              title="Add to Calendar"
            >
              <span className="action-icon">📅</span>
            </button>
          </>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-author">
                  {comment.authorImage ? (
                    <img
                      src={comment.authorImage}
                      alt={comment.authorName}
                      className="comment-avatar"
                    />
                  ) : (
                    <div className="comment-avatar-placeholder">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="comment-content-wrapper">
                    <div className="comment-header">
                      <span className="comment-author-name">{comment.authorName}</span>
                      <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="comment-text">{comment.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          {showCommentInput && currentUser && (
            <div className="comment-input-section">
              <div className="comment-input-wrapper">
                <textarea
                  className="comment-textarea"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <div className="emoji-picker-small">
                  {commonEmojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      className="emoji-btn-small"
                      onClick={() => insertEmoji(emoji)}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="comment-actions">
                <button
                  className="cancel-comment-btn"
                  onClick={() => {
                    setNewComment('');
                    setShowCommentInput(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="submit-comment-btn"
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostInteractions;

