'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'pinet_chat_history';
const MAX_HISTORY = 50;

// ── Hook: useRAGContext ────────────────────────────────────────────────────────
function useRAGContext() {
  const [context, setContext] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cache context in sessionStorage to avoid re-fetching
    const cached = sessionStorage.getItem('pinet_rag_context');
    if (cached) {
      setContext(cached);
      setLoaded(true);
      return;
    }

    fetch('/api/chat/context')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.context) {
          setContext(data.context);
          sessionStorage.setItem('pinet_rag_context', data.context);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return { context, loaded };
}

// ── Main Component ─────────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const { context, loaded } = useRAGContext();

  // ── Load history from localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed.slice(-MAX_HISTORY));
      }
    } catch {}
  }, []);

  // ── Persist to localStorage ──
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const toSave = messages.filter((m) => !m.streaming);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave.slice(-MAX_HISTORY)));
      } catch {}
    }
  }, [messages]);

  // ── Scroll to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Focus input on open ──
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const assistantId = `a_${Date.now()}`;
    const assistantMsg = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputValue('');
    setIsStreaming(true);

    // Build history for API (exclude the current empty assistant message)
    const historyForAPI = messages
      .filter((m) => !m.streaming)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      abortRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForAPI,
          context,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Response failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              accumulated += `\n\n*Kesalahan: ${parsed.error}*`;
            } else if (parsed.text) {
              accumulated += parsed.text;
            }

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated, streaming: true } : m
              )
            );
          } catch {}
        }
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: accumulated, streaming: false } : m
        )
      );

      if (!isOpen) setHasUnread(true);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Maaf, terjadi kesalahan. Silakan coba lagi.', streaming: false }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [inputValue, isStreaming, messages, context, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* ── Floating Chat Button ── */}
      {/* Matches ScrollToTop: fixed bottom-8, positioned to the left of it */}
      <button
        id="chat-widget-toggle"
        onClick={() => setIsOpen((p) => !p)}
        className="fixed bottom-8 z-40 group"
        style={{ right: 'calc(2rem + 56px + 12px)', animation: 'bounceIn 0.6s ease-out' }}
        aria-label={isOpen ? 'Tutup chat' : 'Buka chat'}
        title="Chat dengan PINET Assistant"
      >
        <div className="relative">
          {/* Outer ring — matches ScrollToTop SVG size */}
          <div className="w-14 h-14 flex items-center justify-center">
            {/* Inner circle — identical to ScrollToTop inner button */}
            <div className="w-12 h-12 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center shadow-lg group-hover:bg-primary-700 dark:group-hover:bg-primary-600 transition-all duration-300 group-hover:scale-110 animate-pulse-glow relative">
              {isOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              )}
              {hasUnread && !isOpen && <span className="chat-unread-dot" />}
            </div>
          </div>
        </div>
      </button>

      {/* ── Chat Panel ── */}
      <div className={`chat-widget-panel ${isOpen ? 'chat-widget-open' : ''}`} role="dialog" aria-label="Vanka-AI Chat Assistant">
        {/* Header */}
        <div className="chat-widget-header">
          <div className="chat-widget-avatar">
            <img
              src="/Prima.png"
              alt="Vanka-AI"
              className="chat-avatar-img"
            />
            <span className="chat-widget-status-dot" />
          </div>
          <div className="chat-widget-header-info">
            <h3>Vanka-AI</h3>
            <span>{loaded ? 'Online · Siap membantu' : 'Memuat konteks...'}</span>
          </div>
          <div className="chat-widget-header-actions">
            <button onClick={clearHistory} title="Hapus riwayat" className="chat-header-btn" aria-label="Hapus riwayat chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
            <button onClick={() => setIsOpen(false)} title="Tutup" className="chat-header-btn" aria-label="Tutup chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-widget-messages">
          {messages.length === 0 && (
            <div className="chat-widget-empty">
              <div className="chat-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <p>Halo! Saya <strong>Vanka-AI</strong>.</p>
              <p>Tanyakan apa saja tentang produk, layanan, atau perusahaan kami.</p>
              <div className="chat-suggestions">
                {['Apa layanan utama PINET?', 'Ceritakan tentang perusahaan', 'Ada lowongan kerja?'].map((s) => (
                  <button
                    key={s}
                    className="chat-suggestion-chip"
                    onClick={() => { setInputValue(s); inputRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message chat-message-${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chat-msg-avatar">
                  <img src="/Prima.png" alt="Vanka" className="chat-msg-avatar-img" />
                </div>
              )}
              <div className="chat-message-bubble">
                {msg.role === 'assistant' ? (
                  <div className="chat-markdown">
                    {/* Show typing dots when content is empty (initial wait) */}
                    {msg.streaming && msg.content === '' ? (
                      <div className="chat-inline-typing">
                        <span className="chat-typing-dot" style={{ animationDelay: '0ms' }} />
                        <span className="chat-typing-dot" style={{ animationDelay: '150ms' }} />
                        <span className="chat-typing-dot" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || ''}
                      </ReactMarkdown>
                    )}
                  </div>
                ) : (
                  <span>{msg.content}</span>
                )}
                <span className="chat-timestamp">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {/* Separate dots bubble only shown if the last assistant message doesn't exist yet */}
          {isStreaming && !messages.some(m => m.role === 'assistant' && m.streaming) && (
            <div className="chat-message chat-message-assistant">
              <div className="chat-msg-avatar">
                <img src="/Prima.png" alt="Vanka" className="chat-msg-avatar-img" />
              </div>
              <div className="chat-message-bubble chat-typing-bubble">
                <span className="chat-typing-dot" style={{ animationDelay: '0ms' }} />
                <span className="chat-typing-dot" style={{ animationDelay: '150ms' }} />
                <span className="chat-typing-dot" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-widget-input-area">
          <textarea
            ref={inputRef}
            id="chat-widget-input"
            className="chat-widget-input"
            placeholder="Ketik pesan..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isStreaming}
          />
          <button
            id="chat-widget-send"
            className={`chat-widget-send ${isStreaming ? 'chat-send-loading' : ''}`}
            onClick={sendMessage}
            disabled={isStreaming || !inputValue.trim()}
            aria-label="Kirim pesan"
          >
            {isStreaming ? (
              <svg className="chat-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        /* ── Toggle Button ────────────────────────────────────────────────────── */
        /* Positioning handled via Tailwind on the button element */
        :global(.chat-unread-dot) {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fbbf24;
          border: 2px solid white;
          animation: chat-ping 1s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes chat-ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        /* ── Panel ─────────────────────────────────────────────────────────────── */
        .chat-widget-panel {
          position: fixed;
          bottom: 6.5rem;
          right: calc(2rem + 56px + 12px + 14px);
          z-index: 49;
          width: 490px;
          max-height: 720px;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: rgba(15, 15, 18, 0.95);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 1px rgba(225,29,72,0.15),
            0 8px 40px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06);
          transform-origin: bottom right;
          transform: scale(0.85) translateY(20px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
        }
        .chat-widget-panel.chat-widget-open {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        /* ── Header ──────────────────────────────────────────────────────────── */
        .chat-widget-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: rgba(225, 29, 72, 0.08);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .chat-widget-avatar {
          position: relative;
          flex-shrink: 0;
        }
        .chat-avatar-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 0 12px rgba(225,29,72,0.35);
          border: 1.5px solid rgba(225,29,72,0.4);
          background: #1a0a0e;
        }
        .chat-widget-status-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid rgba(15,15,18,0.92);
          animation: chat-pulse-dot 2s infinite;
        }
        @keyframes chat-pulse-dot {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .chat-widget-header-info {
          flex: 1;
        }
        .chat-widget-header-info h3 {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 0.3px;
        }
        .chat-widget-header-info span {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
        }
        .chat-widget-header-actions {
          display: flex;
          gap: 4px;
        }
        .chat-header-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .chat-header-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        /* ── Messages ─────────────────────────────────────────────────────────── */
        .chat-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
        }
        .chat-widget-messages::-webkit-scrollbar { width: 4px; }
        .chat-widget-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-widget-messages::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        /* Empty state */
        .chat-widget-empty {
          text-align: center;
          padding: 24px 12px;
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          line-height: 1.6;
        }
        .chat-empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(225,29,72,0.1);
          border: 1px solid rgba(225,29,72,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        .chat-empty-icon svg {
          width: 22px;
          height: 22px;
          stroke: #e11d48;
        }
        .chat-widget-empty p { margin: 2px 0; }
        .chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          margin-top: 14px;
        }
        .chat-suggestion-chip {
          font-size: 10px;
          padding: 5px 10px;
          border-radius: 20px;
          border: 1px solid rgba(225,29,72,0.3);
          background: rgba(225,29,72,0.07);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s;
        }
        .chat-suggestion-chip:hover {
          background: rgba(225,29,72,0.18);
          border-color: rgba(225,29,72,0.5);
          color: #fff;
        }

        /* Messages */
        .chat-message {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          animation: chat-bounce-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes chat-bounce-in {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .chat-message-user {
          flex-direction: row-reverse;
        }
        .chat-msg-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .chat-msg-avatar-img {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(225,29,72,0.35);
          background: #1a0a0e;
        }
        /* dots inside bubble when content is empty */
        .chat-inline-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 2px;
        }
        .chat-message-bubble {
          max-width: 75%;
          padding: 8px 12px;
          border-radius: 14px;
          font-size: 12px;
          line-height: 1.55;
          position: relative;
        }
        .chat-message-assistant .chat-message-bubble {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom-left-radius: 4px;
          color: rgba(255,255,255,0.88);
        }
        .chat-message-user .chat-message-bubble {
          background: linear-gradient(135deg, #e11d48, #9f1239);
          border-bottom-right-radius: 4px;
          color: #fff;
          box-shadow: 0 2px 12px rgba(225,29,72,0.3);
        }
        .chat-timestamp {
          display: block;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
          text-align: right;
        }
        .chat-message-user .chat-timestamp { text-align: right; }

        /* Markdown */
        .chat-markdown { color: rgba(255,255,255,0.88); font-size: 12px; line-height: 1.6; }
        .chat-markdown :global(p) { margin: 0 0 4px; }
        .chat-markdown :global(ul), .chat-markdown :global(ol) { padding-left: 16px; margin: 4px 0; }
        .chat-markdown :global(li) { margin-bottom: 2px; }
        .chat-markdown :global(strong) { color: #fca5a5; font-weight: 600; }
        .chat-markdown :global(em) { color: rgba(255,255,255,0.7); }
        .chat-markdown :global(code) {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 11px;
          font-family: monospace;
        }
        .chat-markdown :global(pre) {
          background: rgba(0,0,0,0.4);
          border-radius: 8px;
          padding: 8px;
          overflow-x: auto;
          margin: 6px 0;
        }
        .chat-markdown :global(h1),
        .chat-markdown :global(h2),
        .chat-markdown :global(h3) {
          font-size: 12px;
          font-weight: 700;
          color: #fca5a5;
          margin: 6px 0 2px;
        }
        .chat-markdown :global(a) { color: #f87171; }
        .chat-markdown :global(blockquote) {
          border-left: 2px solid rgba(225,29,72,0.5);
          padding-left: 8px;
          margin: 4px 0;
          color: rgba(255,255,255,0.6);
        }
        .chat-markdown :global(hr) { border-color: rgba(255,255,255,0.1); margin: 6px 0; }

        /* Cursor animation */
        .chat-cursor {
          display: inline-block;
          width: 2px;
          height: 12px;
          background: #e11d48;
          margin-left: 2px;
          vertical-align: middle;
          animation: chat-blink 0.7s infinite;
        }
        @keyframes chat-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* Typing dots */
        .chat-typing-bubble {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px !important;
        }
        .chat-typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          display: block;
          animation: chat-typing-bounce 0.8s ease-in-out infinite;
        }
        @keyframes chat-typing-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        /* ── Input Area ───────────────────────────────────────────────────────── */
        .chat-widget-input-area {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
        }
        .chat-widget-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.88);
          font-size: 12px;
          padding: 8px 12px;
          resize: none;
          outline: none;
          max-height: 100px;
          line-height: 1.5;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .chat-widget-input:focus {
          border-color: rgba(225,29,72,0.5);
          background: rgba(255,255,255,0.08);
        }
        .chat-widget-input::placeholder { color: rgba(255,255,255,0.25); }
        .chat-widget-input:disabled { opacity: 0.5; }

        .chat-widget-send {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #e11d48, #9f1239);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(225,29,72,0.3);
        }
        .chat-widget-send:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(225,29,72,0.45);
        }
        .chat-widget-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .chat-spin {
          animation: chat-spin-anim 0.8s linear infinite;
        }
        @keyframes chat-spin-anim { to { transform: rotate(360deg); } }

        /* ── Responsive ───────────────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .chat-widget-panel {
            width: calc(100vw - 2rem);
            right: 1rem;
            left: 1rem;
            bottom: 7rem;
            max-height: 75vh;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
