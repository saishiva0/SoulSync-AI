import React, { createContext, useState, useCallback, useMemo } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentRelation, setCurrentRelation] = useState('best_friend');
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Memoize the relations object to prevent unnecessary recreations
  const relations = useMemo(() => ({
    best_friend: {
      name: "Best Friend",
      emoji: "🤝",
      tagline: "Your ride or die!",
      context: "Respond like a close best friend: use slang, be funny, and keep it real."
    },
    girlfriend: {
      name: "Girlfriend",
      emoji: "💖", 
      tagline: "Your virtual sweetheart",
      context: "Respond as a loving girlfriend: be affectionate and caring."
    },
    boyfriend: {
      name: "Boyfriend",
      emoji: "👍",
      tagline: "Your supportive partner",
      context: "Respond as a caring boyfriend: be encouraging and protective."
    },
    therapist: {
      name: "Therapist",
      emoji: "🧠",
      tagline: "Professional guidance",
      context: "Respond as a licensed therapist: ask thoughtful questions and provide insights."
    },
    family: {
      name: "Family",
      emoji: "👨‍👩‍👧‍👦",
      tagline: "Unconditional love",
      context: "Respond as a caring family member: show warmth and concern."
    },
    motivator: {
      name: "Motivator",
      emoji: "💪",
      tagline: "Push your limits!",
      context: "Respond as a motivational coach: inspire and encourage growth."
    }
  }), []); // Empty dependency array means this object is created once

  const startNewChat = useCallback(() => {
    if (activeChat.length > 0) {
      setChats(prev => [...prev, {
        relation: currentRelation,
        messages: [...activeChat],
        time: new Date()
      }]);
      setActiveChat([]);
    }
  }, [activeChat, currentRelation]);

  const generateAIResponse = useCallback(async (message) => {
    setIsTyping(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBUJ5TsGLzjbZUZ5kkE9Ziccm7wWpFFBSM`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${relations[currentRelation].context}\n\nUser: ${message}\nAI:`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        throw new Error('Invalid response format from API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('API Error:', error);
      return "I'm having trouble responding right now. Could you try again?";
    } finally {
      setIsTyping(false);
    }
  }, [currentRelation, relations]); // Now relations is properly memoized

  const contextValue = useMemo(() => ({
    relations,
    currentRelation,
    setCurrentRelation,
    chats,
    activeChat,
    setActiveChat,
    sidebarOpen,
    setSidebarOpen,
    generateAIResponse,
    isTyping,
    startNewChat
  }), [
    relations,
    currentRelation,
    chats,
    activeChat,
    sidebarOpen,
    generateAIResponse,
    isTyping,
    startNewChat
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};