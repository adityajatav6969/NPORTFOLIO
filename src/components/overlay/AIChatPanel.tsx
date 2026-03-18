import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { portfolioData } from '../../data/portfolio';

interface Message {
  text: string;
  from: 'user' | 'ai';
}

function getAIResponse(input: string): string {
  const q = input.toLowerCase();
  const r = portfolioData.aiResponses;
  if (q.includes('skill') || q.includes('tech') || q.includes('know')) return r.skills;
  if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('made')) return r.projects;
  if (q.includes('experience') || q.includes('background') || q.includes('who')) return r.experience;
  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire')) return r.contact;
  if (q.includes('technolog') || q.includes('stack') || q.includes('tool')) return r.technologies;
  return r.default;
}

export function AIChatPanel() {
  const { isChatOpen, toggleChat } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    { text: portfolioData.aiResponses.greeting, from: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, from: 'user' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(userMsg);
      setMessages((prev) => [...prev, { text: response, from: 'ai' }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={`ai-chat-panel ${isChatOpen ? 'open' : ''}`}>
      <div className="ai-panel-header">
        <div className="ai-panel-title">🧠 Portfolio Brain</div>
        <button className="ai-close-btn" onClick={toggleChat}>✕</button>
      </div>

      <div className="ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.from === 'ai' ? 'received' : 'sent'}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="chat-message received" style={{ opacity: 0.6 }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-container">
        <input
          className="ai-input"
          placeholder="Ask about skills, projects..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={handleSend}>→</button>
      </div>
    </div>
  );
}
