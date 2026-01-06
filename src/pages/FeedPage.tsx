import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import { dummyPosts } from '../data/dummyData';
import AppHeader from '../components/AppHeader';
import './FeedPage.css';

const FeedPage = () => {
  const { currentUser, posts, addPost } = useApp();
  const [allPosts, setAllPosts] = useState<Post[]>([...dummyPosts, ...posts]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

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

  const handleSubmitPost = () => {
    if (!currentUser || !newPostContent.trim()) return;

    const newPost: Post = {
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

    addPost(newPost);
    setAllPosts([newPost, ...allPosts]);
    setNewPostContent('');
    setNewPostImage(null);
    setShowPostForm(false);
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
      <div className="feed-content">
        <div className="feed-header">
          <h1 className="page-title">Your Feed</h1>
          <button
            className="new-post-button"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            + New Post
          </button>
        </div>

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
          {allPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="author-avatar"
                    />
                  ) : (
                    <div className="author-avatar-placeholder">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="author-name">{post.authorName}</div>
                    <div className="post-time">{formatDate(post.createdAt)}</div>
                  </div>
                </div>
              </div>
              <p className="post-content">{post.content}</p>
              {post.image && (
                <div className="post-image-container">
                  <img src={post.image} alt="Post" className="post-image" />
                </div>
              )}
              <div className="post-actions">
                <button className="post-action-btn">
                  👍 Like ({post.likes.length})
                </button>
                <button className="post-action-btn">
                  💬 Comment ({post.comments.length})
                </button>
                <button className="post-action-btn">🔗 Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;

