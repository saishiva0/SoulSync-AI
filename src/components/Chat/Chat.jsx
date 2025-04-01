import React, { useContext, useRef, useEffect, useState } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { motion } from 'framer-motion';
import './styles.css';

export default function Chat() {
  const { 
    currentRelation,
    relations,
    setCurrentRelation,
    activeChat,
    setActiveChat,
    generateAIResponse,
    isTyping,
    setSidebarOpen,
    sidebarOpen,
    startNewChat
  } = useContext(ChatContext);

  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    if (!message) return;

    setActiveChat(prev => [...prev, { text: message, sender: 'user' }]);
    e.target.reset();

    const response = await generateAIResponse(message);
    setActiveChat(prev => [...prev, { text: response, sender: 'bot' }]);
  };

  const changeRelation = (relation) => {
    startNewChat();
    setCurrentRelation(relation);
    setShowRelationDropdown(false);
  };

  return (
    <div className={`chat-area ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Header */}
      <header className="chat-header">
        <button 
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        
        <h1 className="chat-title">SoulSync-AI</h1>
        
        <div className="relation-selector">
          <button 
            className="relation-btn"
            onClick={() => setShowRelationDropdown(!showRelationDropdown)}
          >
            <span className="relation-emoji">{relations[currentRelation].emoji}</span>
            {relations[currentRelation].name}
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {showRelationDropdown && (
            <div className="relation-dropdown">
              {Object.entries(relations).map(([key, relation]) => (
                <div
                  key={key}
                  className={`relation-option ${currentRelation === key ? 'active' : ''}`}
                  onClick={() => changeRelation(key)}
                >
                  <span className="option-emoji">{relation.emoji}</span>
                  <div>
                    <div className="option-name">{relation.name}</div>
                    <div className="option-tagline">{relation.tagline}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="messages-container">
        {activeChat.length === 0 ? (
          <div className="welcome-message">
            <h2>Welcome to SoulSync AI</h2>
            <p>Select a relationship, type and start chatting!</p>
          </div>
        ) : (
          activeChat.map((msg, i) => (
            <motion.div 
              key={i} 
              className={`message ${msg.sender}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              {msg.text}
            </motion.div>
          ))
        )}
        
        {isTyping && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="typing-dots">
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            Typing something Special...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="input-container">
        <input
          name="message"
          className="message-input"
          placeholder="Type your message..."
          autoComplete="off"
          aria-label="Type your message"
        />
        <button
            type="submit"
            className="send-button"
            aria-label="Send message"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
        <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            >
            <path 
            fill="currentColor" 
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            />
        </motion.svg>
        </button>
      </form>
      
      <div className="tagline">
        AI-Generated, but with lots of love ❤️
      </div>
    </div>
  );
}