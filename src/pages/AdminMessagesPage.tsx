'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { AdminMessage } from '../types';
import { adminMessageService, userService } from '../services/localDataService';
import './AdminMessagesPage.css';

const AdminMessagesPage = () => {
  const router = useRouter();
  const { currentUser } = useApp();
  const [threads, setThreads] = useState<{ userId: string; user: any; lastMessage: AdminMessage; unread: number }[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) router.replace('/announcements');
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      const rawThreads = await adminMessageService.getThreads(currentUser.id);
      const enriched = await Promise.all(
        rawThreads.map(async t => {
          const user = await userService.getUser(t.userId);
          return { ...t, user };
        })
      );
      setThreads(enriched);
    };
    load();
  }, [currentUser]);

  const openThread = async (userId: string) => {
    if (!currentUser) return;
    setActiveUserId(userId);
    const msgs = await adminMessageService.getThread(currentUser.id, userId);
    setMessages(msgs);
    await adminMessageService.markRead(currentUser.id, userId);
    // Refresh threads to clear unread
    const rawThreads = await adminMessageService.getThreads(currentUser.id);
    const enriched = await Promise.all(rawThreads.map(async t => {
      const user = await userService.getUser(t.userId);
      return { ...t, user };
    }));
    setThreads(enriched);
  };

  const startNewThread = async (userId: string) => {
    setShowUserPicker(false);
    await openThread(userId);
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !activeUserId) return;
    const msg = await adminMessageService.send({
      adminId: currentUser.id,
      userId: activeUserId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content: input.trim(),
    });
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const load = async () => {
      const users = await userService.getAllUsers();
      setAllUsers(users.filter(u => !u.isAdmin));
    };
    load();
  }, []);

  const activeUser = allUsers.find(u => u.id === activeUserId) || threads.find(t => t.userId === activeUserId)?.user;

  if (!currentUser?.isAdmin) return null;

  // Thread list view
  if (!activeUserId) {
    return (
      <div className="admin-msg-page">
        <div className="admin-msg-header">
          <button className="admin-msg-back" onClick={() => router.push('/admin')}>‹</button>
          <h1 className="admin-msg-title">Messages</h1>
          <button className="admin-msg-compose" onClick={() => setShowUserPicker(true)}>+</button>
        </div>

        {showUserPicker && (
          <div className="user-picker-overlay" onClick={() => setShowUserPicker(false)}>
            <div className="user-picker" onClick={e => e.stopPropagation()}>
              <p className="user-picker-title">New Message</p>
              <div className="user-picker-list">
                {allUsers.map(u => (
                  <div key={u.id} className="user-picker-item" onClick={() => startNewThread(u.id)}>
                    <div className="user-picker-avatar">
                      {u.profileImage ? <img src={u.profileImage} alt={u.fullName} /> : u.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="user-picker-name">{u.fullName}</p>
                      <p className="user-picker-email">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="admin-msg-threads">
          {threads.length === 0 ? (
            <div className="admin-msg-empty">
              <p>No conversations yet.</p>
              <button onClick={() => setShowUserPicker(true)}>Start a conversation</button>
            </div>
          ) : (
            threads.map(t => (
              <div key={t.userId} className="thread-row" onClick={() => openThread(t.userId)}>
                <div className="thread-avatar">
                  {t.user?.profileImage ? (
                    <img src={t.user.profileImage} alt={t.user?.fullName} />
                  ) : (
                    <span>{t.user?.fullName?.charAt(0) ?? '?'}</span>
                  )}
                </div>
                <div className="thread-info">
                  <p className="thread-name">{t.user?.fullName ?? 'Unknown'}</p>
                  <p className="thread-last">{t.lastMessage.content.substring(0, 50)}{t.lastMessage.content.length > 50 ? '…' : ''}</p>
                </div>
                {t.unread > 0 && <span className="thread-unread">{t.unread}</span>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="admin-msg-page">
      <div className="admin-msg-header">
        <button className="admin-msg-back" onClick={() => setActiveUserId(null)}>‹</button>
        <div className="admin-chat-user-info">
          <div className="admin-chat-avatar">
            {activeUser?.profileImage ? (
              <img src={activeUser.profileImage} alt={activeUser.fullName} />
            ) : (
              <span>{activeUser?.fullName?.charAt(0) ?? '?'}</span>
            )}
          </div>
          <div>
            <p className="admin-chat-name">{activeUser?.fullName ?? 'Member'}</p>
            <p className="admin-chat-email">{activeUser?.email ?? ''}</p>
          </div>
        </div>
        <button className="admin-msg-profile-btn" onClick={() => router.push(`/profile/${activeUserId}`)}>👤</button>
      </div>

      <div className="admin-chat-messages">
        {messages.length === 0 && (
          <div className="admin-chat-empty">Send your first message to {activeUser?.fullName?.split(' ')[0] ?? 'this member'}</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}>
            <p className="chat-bubble-text">{msg.content}</p>
            <span className="chat-bubble-time">
              {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="admin-chat-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message…"
          className="admin-chat-input"
        />
        <button className="admin-chat-send" onClick={sendMessage} disabled={!input.trim()}>Send</button>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
