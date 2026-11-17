import React, { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../../api.js';

const SESSION_KEY = 'sales_assistant_session';

const QUICK_ACTIONS = [
  { label: '📊 Dashboard KPIs', message: 'Show me the sales dashboard KPIs and current performance summary' },
  { label: '⚠️ Overdue Orders', message: 'Show me all overdue orders and credit blocked orders that need attention' },
  { label: '🎯 Recommendations', message: 'Generate AI-powered sales recommendations and identify at-risk customers' },
  { label: '🔍 At-Risk Customers', message: 'Find customers with high credit utilization or declining order patterns' }
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '1rem', gap: '0.5rem', alignItems: 'flex-end' }}>
      {!isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0070f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>🤖</div>
      )}
      <div style={{
        maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#0070f2' : '#fff', color: isUser ? '#fff' : '#32363a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', lineHeight: '1.6', fontSize: '0.875rem'
      }}>
        {msg.error ? (
          <span style={{ color: isUser ? '#ffcccc' : '#BB0000' }}>⚠️ {msg.content}</span>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
        )}
        {msg.toolsUsed && msg.toolsUsed.length > 0 && (
          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${isUser ? 'rgba(255,255,255,0.3)' : '#e5e5e5'}`, fontSize: '0.72rem', opacity: 0.8 }}>
            🔧 Tools: {msg.toolsUsed.join(', ')}
          </div>
        )}
        <div style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: '0.25rem', textAlign: isUser ? 'right' : 'left' }}>
          {msg.time}
        </div>
      </div>
      {isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>👤</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem', gap: '0.5rem', alignItems: 'flex-end' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0070f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>🤖</div>
      <div style={{ padding: '0.75rem 1rem', borderRadius: '18px 18px 18px 4px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#0070f2',
              animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
              animationName: 'typing-bounce'
            }} />
          ))}
        </div>
        <style>{`
          @keyframes typing-bounce {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1.2); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function AISalesAssistantScreen({ onSampleDataChange }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome', role: 'assistant', content:
        '👋 Welcome to the Intelligent Sales Assistant!\n\nI can help you with:\n• 📊 Sales Dashboard KPIs and performance trends\n• 👥 Customer analysis and risk assessment\n• 📦 Sales order status and exceptions\n• 🎯 AI-powered recommendations\n\nTry one of the quick actions below or type your question.',
      time: new Date().toLocaleTimeString(), toolsUsed: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => sessionStorage.getItem(SESSION_KEY) || `session-${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (messageText) => {
    const text = messageText || input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content: text, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await api.sendMessage(text, sessionId);
      if (onSampleDataChange) onSampleDataChange(result.isSampleData);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant', content: result.response,
        toolsUsed: result.toolsUsed || [], time: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant', content: `Unable to reach the sales assistant: ${err.message}. Please try again.`,
        error: true, time: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, sessionId, onSampleDataChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome', role: 'assistant', content: 'Chat cleared. How can I help you today?',
      time: new Date().toLocaleTimeString(), toolsUsed: []
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', gap: '0.75rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#32363a' }}>🤖 AI Sales Assistant</h1>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#8a8d90' }}>Powered by SAP Joule · Session: {sessionId.slice(-8)}</p>
        </div>
        <button onClick={clearChat} style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.78rem', color: '#6a6d70' }}>
          🗑 Clear Chat
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a.label} onClick={() => sendMessage(a.message)} disabled={loading}
            style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: '20px', padding: '0.35rem 0.85rem', cursor: 'pointer', fontSize: '0.78rem', color: '#32363a', fontWeight: '500', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.target.style.background = '#e8f4ff'; e.target.style.borderColor = '#0070f2'; }}
            onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#d9d9d9'; }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', minHeight: '300px' }}>
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: '#fff', borderRadius: '12px', padding: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about sales orders, customers, KPIs, or recommendations… (Enter to send)"
          disabled={loading}
          style={{ flex: 1, border: '1px solid #d9d9d9', borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.875rem', resize: 'none', height: '64px', fontFamily: 'inherit', outline: 'none' }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? '#e5e5e5' : '#0070f2', color: '#fff', border: 'none', borderRadius: '8px',
            padding: '0.75rem 1.25rem', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.875rem', height: '64px'
          }}>
          {loading ? '⟳' : '➤'}
        </button>
      </div>
    </div>
  );
}
