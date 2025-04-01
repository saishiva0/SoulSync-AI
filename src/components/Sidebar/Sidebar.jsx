import React, { useContext } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import './styles.css';

export default function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    currentRelation,
    relations,
    chats
  } = useContext(ChatContext);

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <h3>Chat History</h3>
      </div>

      <div className="chat-history">
        {chats.map((chat, i) => (
          <div key={i} className="chat-item">
            <span className="relation-emoji">{relations[chat.relation].emoji}</span>
            <div>
              <div className="chat-preview">
                {chat.messages[0]?.text.substring(0, 30)}...
              </div>
              <div className="chat-time">
                {new Date(chat.time).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed at bottom */}
      <div className="user-profile">
        <div className="profile-icon">
          {relations[currentRelation].emoji}
        </div>
        <h4 className="user-relation">{relations[currentRelation].name}</h4>
        <p className="user-tagline">{relations[currentRelation].tagline}</p>
      </div>
    </div>
  );
}