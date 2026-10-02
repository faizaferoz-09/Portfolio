import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, MessageSquare, Send, X, Sparkles, 
  CornerDownRight, Zap, ChevronRight, HelpCircle 
} from 'lucide-react';
import { CHATBOT_PROMPTS, findChatbotReply } from '../js/data/chatbotFaqData';

export default function ChatbotWidget({
  onNavigateTab,
  onSelectCategory,
  onOpenCart
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Greetings, Multiverse Traveler! I am **VerseBot**, your AI fandom guide.
Ask me about anime recommendations, upcoming conventions, top gaming lore, official merch, or how bookmarks work!`,
      suggestedChips: ['Recommend Top Anime', 'Upcoming Fandom Events', 'Hot Merchandise & Figurines'],
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate smart thinking delay
    setTimeout(() => {
      const replyData = findChatbotReply(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyData.text,
        action: replyData.action,
        suggestedChips: replyData.suggestedChips,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleExecuteAction = (action) => {
    if (!action) return;
    if (action.type === 'navigate_category') {
      onSelectCategory(action.category);
      onNavigateTab('categories');
    } else if (action.type === 'navigate_tab') {
      if (action.tab === 'store') {
        onNavigateTab('store');
      } else {
        onNavigateTab(action.tab);
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-launcher-btn"
        title="Chat with VerseBot AI Guide"
      >
        <div className="chatbot-pulse-ring" />
        {isOpen ? <X size={26} /> : <Bot size={28} />}
      </button>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="chatbot-title">VerseBot AI Guide</h4>
                <div className="chatbot-status">
                  <span className="status-dot" />
                  <span>Online • Rule-Based Assistant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close-btn"
              aria-label="Close Chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="chatbot-messages-body">
            {messages.map((m) => {
              const isUser = m.sender === 'user';

              return (
                <div key={m.id} className={`message-bubble-row ${isUser ? 'user-row' : ''}`}>
                  {!isUser && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d2d, #ff7a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0, boxShadow: '0 2px 8px rgba(255, 77, 45, 0.35)' }}>
                      <Bot size={15} />
                    </div>
                  )}

                  <div className={`chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.text}</p>

                    {/* Interactive Action Jump Button */}
                    {m.action && (
                      <button
                        onClick={() => handleExecuteAction(m.action)}
                        className="bot-action-btn"
                      >
                        <Zap size={13} />
                        <span>Jump to Section</span>
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="message-bubble-row">
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d2d, #ff7a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
                  <Bot size={15} />
                </div>
                <div className="chat-bubble bot-bubble" style={{ display: 'flex', gap: '5px', padding: '0.6rem 0.8rem', color: '#ff684a' }}>
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="chatbot-chips-wrap">
            {CHATBOT_PROMPTS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleSendMessage(chip.query)}
                className="prompt-chip-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {chip.iconClass && <i className={chip.iconClass} style={{ color: '#ff684a', fontSize: '0.75rem' }}></i>}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="chatbot-input-form"
          >
            <input
              type="text"
              placeholder="Ask about anime, games, lore, merch..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="chatbot-input-field"
            />
            <button type="submit" className="chatbot-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
