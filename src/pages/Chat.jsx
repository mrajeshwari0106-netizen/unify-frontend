import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am the Unify AI assistant. Ask me anything about government welfare schemes in English or Tamil. / வணக்கம்! அரசு திட்டங்கள் பற்றி கேளுங்கள்.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post('/chat/message', {
        message: userMsg,
        language: language,
      });
      const reply = res.data.aiResponse || res.data.response || res.data.message || 'Sorry, I could not process that.';
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please check your connection and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const suggestions = [
    'What schemes are available for farmers?',
    'Scholarship schemes for students?',
    'விவசாயிகளுக்கு என்ன திட்டங்கள்?',
    'Schemes for women entrepreneurs?',
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>AI Assistant</h2>
          <p style={styles.subtitle}>⚡ Powered by Gemini AI · English & Tamil</p>
        </div>
        <div style={styles.langToggle}>
          <button
            style={language === 'english' ? styles.langActive : styles.langInactive}
            onClick={() => setLanguage('english')}
          >English</button>
          <button
            style={language === 'tamil' ? styles.langActive : styles.langInactive}
            onClick={() => setLanguage('tamil')}
          >தமிழ்</button>
        </div>
      </div>

      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
              {msg.role === 'ai' && (
                <div style={styles.aiAvatar}>U</div>
              )}
              <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
              <div style={styles.aiAvatar}>U</div>
              <div style={styles.aiBubble}>
                <span style={{ letterSpacing: 4, color: '#6FCFA0' }}>● ● ●</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={styles.suggestions}>
          {suggestions.map((s, i) => (
            <button key={i} style={styles.suggestion} onClick={() => setInput(s)}>
              {s}
            </button>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={language === 'tamil' ? 'இங்கே தட்டச்சு செய்யுங்கள்...' : 'Ask about welfare schemes...'}
            disabled={loading}
          />
          <button style={styles.sendBtn} onClick={send} disabled={loading || !input.trim()}>
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 820, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 700, color: '#0D3B2E', marginBottom: 4 },
  subtitle: { color: '#6FCFA0', fontSize: 13 },
  langToggle: { display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #C8EDD8' },
  langActive: { padding: '8px 20px', background: '#0D3B2E', color: '#00C853', border: 'none', fontWeight: 700, fontSize: 13 },
  langInactive: { padding: '8px 20px', background: '#fff', color: '#6FCFA0', border: 'none', fontWeight: 500, fontSize: 13 },
  chatBox: { background: '#fff', borderRadius: 16, border: '1px solid #C8EDD8', boxShadow: '0 4px 20px rgba(13,59,46,0.08)', display: 'flex', flexDirection: 'column', height: 560 },
  messages: { flex: 1, overflowY: 'auto', padding: 24 },
  aiAvatar: { width: 32, height: 32, background: '#0D3B2E', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#00C853', marginRight: 10, flexShrink: 0, alignSelf: 'flex-end' },
  aiBubble: { background: '#E8F8EF', border: '1px solid #C8EDD8', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', maxWidth: '75%', fontSize: 14, color: '#0D3B2E', lineHeight: 1.6 },
  userBubble: { background: '#0D3B2E', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', maxWidth: '75%', fontSize: 14, color: '#fff', lineHeight: 1.6 },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 20px', borderTop: '1px solid #E8F8EF' },
  suggestion: { padding: '6px 14px', background: '#E8F8EF', color: '#0D3B2E', border: '1px solid #C8EDD8', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  inputRow: { display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid #C8EDD8' },
  input: { flex: 1, padding: '12px 16px', borderRadius: 10, border: '1px solid #C8EDD8', fontSize: 14, outline: 'none', background: '#FAFFFE', color: '#0D3B2E' },
  sendBtn: { padding: '12px 24px', background: '#00C853', color: '#0D3B2E', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700 },
};