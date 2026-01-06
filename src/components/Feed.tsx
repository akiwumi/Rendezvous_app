import './Feed.css'

interface FeedPost {
  username: string
  avatarInitials: string
  hasNewNotification?: boolean
}

const feedPosts: FeedPost[] = [
  { username: 'janesmith', avatarInitials: 'JS', hasNewNotification: true },
  { username: 'nadim', avatarInitials: 'N' },
]

const Feed = () => {
  return (
    <div className="feed">
      {feedPosts.map((post, index) => (
        <div key={index} className="feed-post">
          <div className="post-header">
            <div className="avatar">{post.avatarInitials}</div>
            <div className="username">{post.username}</div>
          </div>
          <div className="post-image-container">
            <div className="post-image"></div>
            {post.hasNewNotification && (
              <div className="notification-badge">
                <span className="badge-text">1 new</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Feed

