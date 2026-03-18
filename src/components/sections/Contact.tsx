import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChatMessage {
  text: string;
  from: 'user' | 'system';
  time: string;
}

const smartReplies = [
  "I'd love to collaborate!",
  'Tell me about your services',
  'Can we schedule a call?',
  'I have a project idea',
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function Contact() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hey there! 👋 I'm always excited to hear about new projects and ideas. Drop me a message and I'll get back to you soon!",
      from: 'system',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { text: msg, from: 'user', time: getTime() }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for reaching out! 🙏 I've noted your message and will respond via email within 24 hours. In the meantime, feel free to explore more of my work!",
          from: 'system',
          time: getTime(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <section id="contact" className="section">
      <div className="section-header">
        <div className="section-label">// 04 — Contact</div>
        <h2 className="section-title">Let's Connect</h2>
      </div>

      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
      >
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">A</div>
            <div className="chat-info">
              <div className="chat-name">Aditya</div>
              <div className="chat-status">● Online</div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.from === 'system' ? 'received' : 'sent'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message received" style={{ opacity: 0.5, fontStyle: 'italic' }}>
                typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="smart-replies">
            {smartReplies.map((reply) => (
              <button key={reply} className="smart-reply" onClick={() => handleSend(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chat-send-btn" onClick={() => handleSend()}>
              →
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
