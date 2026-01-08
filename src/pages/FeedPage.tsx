import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { postService } from '../services/localDataService';
import PostInteractions from '../components/PostInteractions';
import AppHeader from '../components/AppHeader';
import PullToRefresh from '../components/PullToRefresh';
import Stories from '../components/Stories';
import './FeedPage.css';

const FeedPage = () => {
  const navigate = useNavigate();
  const { currentUser, posts, setPosts, addPost, updateUser } = useApp();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };
    if (posts.length === 0) {
      loadPosts();
    }
  }, [posts.length, setPosts]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  const handleProfileClick = (authorId: string) => {
    if (authorId === 'admin-1') {
      navigate('/admin-profile');
    } else {
      navigate(`/profile/${authorId}`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = async () => {
    if (!currentUser || !newPostContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorImage: currentUser.profileImage,
      content: newPostContent,
      image: newPostImage || undefined,
      createdAt: new Date(),
      likes: [],
      comments: [],
    };

    await addPost(newPost);
    setNewPostContent('');
    setNewPostImage(null);
    setShowPostForm(false);
  };

  const handleRefresh = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  if (!currentUser) {
    return (
      <div className="feed-page">
        <AppHeader />
        <div className="feed-content">
          <div className="login-prompt">
            <p>Please register to access your feed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <AppHeader />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="feed-content">
          {/* Feed Header with Profile and CTA */}
          <div className="feed-header-modern">
            <div className="feed-header-profile">
              {currentUser.profileImage ? (
                <img src={currentUser.profileImage} alt={currentUser.fullName} className="feed-header-avatar" />
              ) : (
                <div className="feed-header-avatar-placeholder">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="feed-header-text">
                <div className="feed-header-name">{currentUser.fullName}</div>
                <div className="feed-header-cta">Discover, Connect, And Create Together.</div>
              </div>
            </div>
            <button className="feed-notification-btn" onClick={() => navigate('/notifications')}>
              🔔
              {currentUser && <span className="notification-dot"></span>}
            </button>
          </div>

          {/* Search Bar */}
          <div className="feed-search-container">
            <div className="feed-search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search people" className="feed-search-input" />
              <button className="feed-search-filter">☰</button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="feed-tabs">
            <button className="feed-tab active">Discover</button>
            <button className="feed-tab">Following</button>
          </div>

          {/* Stories Section */}
          <Stories />

        {showPostForm && (
          <div className="post-form-card">
            <textarea
              className="post-input"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
            />
            {newPostImage && (
              <div className="post-image-preview">
                <img src={newPostImage} alt="Preview" />
                <button
                  onClick={() => setNewPostImage(null)}
                  className="remove-image-btn"
                >
                  ×
                </button>
              </div>
            )}
            <div className="post-form-actions">
              <label className="image-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                📷 Photo
              </label>
              <button
                className="submit-post-btn"
                onClick={handleSubmitPost}
                disabled={!newPostContent.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}

        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="author-avatar clickable"
                      onClick={() => handleProfileClick(post.authorId)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <div 
                      className="author-avatar-placeholder clickable"
                      onClick={() => handleProfileClick(post.authorId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div 
                      className="author-name clickable"
                      onClick={() => handleProfileClick(post.authorId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {post.authorName}
                    </div>
                    <div className="post-time">{formatDate(post.createdAt)}</div>
                  </div>
                </div>
              </div>
              {post.headline && (
                <h3 className="post-headline">{post.headline}</h3>
              )}
              <p className="post-content">{post.content}</p>
              {post.image && (
                <div className={`post-image-wrapper ${post.authorId === 'admin-1' || post.authorId === 'd8750992-cb10-485d-8d45-2746af3db391' ? 'has-admin-watermark' : ''}`}>
                  <div className="post-image-container">
                    <img src={post.image} alt="Post" className="post-image" />
                  </div>
                  <div className="post-interactions-sidebar">
                    <PostInteractions
                post={post}
                currentUser={currentUser}
                onLike={async (postId) => {
                  if (!currentUser) return;
                  try {
                    const post = posts.find(p => p.id === postId);
                    if (!post) return;
                    
                    const isLiked = post.likes.includes(currentUser.id);
                    const updatedLikes = isLiked
                      ? post.likes.filter(id => id !== currentUser.id)
                      : [...post.likes, currentUser.id];
                    
                    // Update post likes
                    await postService.updatePost(postId, { likes: updatedLikes });
                    
                    // Update user's liked posts array
                    const currentLikedPosts = currentUser.likedPosts || [];
                    const updatedLikedPosts = isLiked
                      ? currentLikedPosts.filter(id => id !== postId)
                      : [...currentLikedPosts, postId];
                    
                    await updateUser(currentUser.id, { likedPosts: updatedLikedPosts });
                    
                    const updatedPosts = await postService.getPosts();
                    setPosts(updatedPosts);
                  } catch (error) {
                    console.error('Error liking post:', error);
                  }
                }}
                onComment={async (postId, commentText) => {
                  if (!currentUser) return;
                  try {
                    const post = posts.find(p => p.id === postId);
                    if (!post) return;
                    
                    const newComment = {
                      id: `comment-${Date.now()}`,
                      authorId: currentUser.id,
                      authorName: currentUser.fullName,
                      authorImage: currentUser.profileImage,
                      content: commentText,
                      createdAt: new Date(),
                    };
                    
                    const updatedComments = [...(post.comments || []), newComment];
                    await postService.updatePost(postId, { comments: updatedComments });
                    const updatedPosts = await postService.getPosts();
                    setPosts(updatedPosts);
                  } catch (error) {
                    console.error('Error adding comment:', error);
                  }
                }}
                onRegisterInterest={async (postId) => {
                  if (!currentUser) return;
                  try {
                    const post = posts.find(p => p.id === postId);
                    if (!post) return;
                    
                    const interestedUsers = post.interestedUsers || [];
                    const isInterested = interestedUsers.includes(currentUser.id);
                    const updatedInterested = isInterested
                      ? interestedUsers.filter(id => id !== currentUser.id)
                      : [...interestedUsers, currentUser.id];
                    
                    await postService.updatePost(postId, { interestedUsers: updatedInterested });
                    const updatedPosts = await postService.getPosts();
                    setPosts(updatedPosts);
                  } catch (error) {
                    console.error('Error registering interest:', error);
                  }
                }}
                onAddToCalendar={(post) => {
                  if (!post.eventDate) return;
                  
                  // Create ICS file for calendar
                  const startDate = new Date(post.eventDate);
                  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
                  
                  const formatICSDate = (date: Date) => {
                    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                  };
                  
                  const icsContent = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//Rendezvous Social Club//EN',
                    'BEGIN:VEVENT',
                    `DTSTART:${formatICSDate(startDate)}`,
                    `DTEND:${formatICSDate(endDate)}`,
                    `SUMMARY:${post.headline || post.content.substring(0, 50)}`,
                    `DESCRIPTION:${post.content}`,
                    post.location ? `LOCATION:${post.location}` : '',
                    'END:VEVENT',
                    'END:VCALENDAR',
                  ].filter(Boolean).join('\r\n');
                  
                  const blob = new Blob([icsContent], { type: 'text/calendar' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${post.headline || 'event'}.ics`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  
                  alert('Calendar event downloaded! Open the .ics file to add to your calendar.');
                }}
                    />
                  </div>
                </div>
              )}
              {!post.image && (
                <PostInteractions
                  post={post}
                  currentUser={currentUser}
                  onLike={async (postId) => {
                    if (!currentUser) return;
                    try {
                      const post = posts.find(p => p.id === postId);
                      if (!post) return;
                      
                      const isLiked = post.likes.includes(currentUser.id);
                      const updatedLikes = isLiked
                        ? post.likes.filter(id => id !== currentUser.id)
                        : [...post.likes, currentUser.id];
                      
                      await postService.updatePost(postId, { likes: updatedLikes });
                      
                      const currentLikedPosts = currentUser.likedPosts || [];
                      const updatedLikedPosts = isLiked
                        ? currentLikedPosts.filter(id => id !== postId)
                        : [...currentLikedPosts, postId];
                      
                      await updateUser(currentUser.id, { likedPosts: updatedLikedPosts });
                      
                      const updatedPosts = await postService.getPosts();
                      setPosts(updatedPosts);
                    } catch (error) {
                      console.error('Error liking post:', error);
                    }
                  }}
                  onComment={async (postId, commentText) => {
                    if (!currentUser) return;
                    try {
                      const post = posts.find(p => p.id === postId);
                      if (!post) return;
                      
                      const newComment = {
                        id: `comment-${Date.now()}`,
                        authorId: currentUser.id,
                        authorName: currentUser.fullName,
                        authorImage: currentUser.profileImage,
                        content: commentText,
                        createdAt: new Date(),
                      };
                      
                      const updatedComments = [...(post.comments || []), newComment];
                      await postService.updatePost(postId, { comments: updatedComments });
                      const updatedPosts = await postService.getPosts();
                      setPosts(updatedPosts);
                    } catch (error) {
                      console.error('Error adding comment:', error);
                    }
                  }}
                  onRegisterInterest={async (postId) => {
                    if (!currentUser) return;
                    try {
                      const post = posts.find(p => p.id === postId);
                      if (!post) return;
                      
                      const interestedUsers = post.interestedUsers || [];
                      const isInterested = interestedUsers.includes(currentUser.id);
                      const updatedInterested = isInterested
                        ? interestedUsers.filter(id => id !== currentUser.id)
                        : [...interestedUsers, currentUser.id];
                      
                      await postService.updatePost(postId, { interestedUsers: updatedInterested });
                      const updatedPosts = await postService.getPosts();
                      setPosts(updatedPosts);
                    } catch (error) {
                      console.error('Error registering interest:', error);
                    }
                  }}
                  onAddToCalendar={(post) => {
                    if (!post.eventDate) return;
                    
                    const startDate = new Date(post.eventDate);
                    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
                    
                    const formatICSDate = (date: Date) => {
                      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                    };
                    
                    const icsContent = [
                      'BEGIN:VCALENDAR',
                      'VERSION:2.0',
                      'PRODID:-//Rendezvous Social Club//EN',
                      'BEGIN:VEVENT',
                      `DTSTART:${formatICSDate(startDate)}`,
                      `DTEND:${formatICSDate(endDate)}`,
                      `SUMMARY:${post.headline || post.content.substring(0, 50)}`,
                      `DESCRIPTION:${post.content}`,
                      post.location ? `LOCATION:${post.location}` : '',
                      'END:VEVENT',
                      'END:VCALENDAR',
                    ].filter(Boolean).join('\r\n');
                    
                    const blob = new Blob([icsContent], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${post.headline || 'event'}.ics`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    alert('Calendar event downloaded! Open the .ics file to add to your calendar.');
                  }}
                />
              )}
            </div>
          ))}
        </div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default FeedPage;

