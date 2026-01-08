import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { userService } from '../services/localDataService';
import { Message, User } from '../types';
import AppHeader from '../components/AppHeader';
import './ChatPage.css';

const ChatPage = () => {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const admin = await userService.getUserByEmail('akiwumi@gmail.com');
        if (admin && admin.isAdmin) {
          setAdminUser(admin);
          // Add welcome message from admin
          setMessages([
            {
              id: 'msg-1',
              senderId: admin.id,
              senderName: admin.fullName,
              senderImage: admin.profileImage,
              content: 'Welcome to Rendezvous Social Club! Feel free to ask any questions.',
              timestamp: new Date(Date.now() - 3600000),
              isAdmin: true,
            },
          ]);
        }
      } catch (error) {
        console.error('Error loading admin user:', error);
      }
    };
    loadAdmin();
  }, []);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentUser || !newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderImage: currentUser.profileImage,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (!currentUser) {
    return (
      <div className="chat-page">
        <AppHeader />
        <div className="chat-content">
          <div className="login-prompt">
            <p>Please register to access chat</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <AppHeader />
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="page-title">Chat</h1>
          <p className="chat-subtitle">Communicate with members and administrators</p>
        </div>

        <div className="messages-container">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`message ${isOwnMessage ? 'own-message' : ''}`}
              >
                {!isOwnMessage && (
                  <div className="message-avatar">
                    {message.senderImage ? (
                      <img
                        src={message.senderImage}
                        alt={message.senderName}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className="message-content-wrapper">
                  {!isOwnMessage && (
                    <div className="message-sender">
                      {message.senderName}
                      {message.isAdmin && <span className="admin-indicator">Admin</span>}
                    </div>
                  )}
                  <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
                    <p className="message-text">{message.content}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

