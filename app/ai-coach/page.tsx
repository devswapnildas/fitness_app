'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import {
  Sparkles,
  Send,
  User,
  Flame,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function AICoachPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "What is today's workout?",
    "How did I perform this week?",
    "Suggest a 30-minute workout.",
    "What exercises train my back?",
    "Why did my workout volume decrease?",
    "Give me a meal idea using eggs and rice.",
  ];

  useEffect(() => {
    fetchConversation();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const res = await fetch('/api/ai/chat');
      if (res.ok) {
        const data = await res.json();
        if (data.conversation?.messages) {
          setMessages(data.conversation.messages);
        } else {
          setMessages([
            {
              id: 'init',
              role: 'assistant',
              content: "Hello Alex! I am your FitAI Assistant. I have secure real-time access to your workout logs, active PRs, nutrition balance, and progressive overload targets. How can I optimize your performance today?",
            },
          ]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = { id: `a-${Date.now()}`, role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pb-24 md:pb-12 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Data-Grounded Assistant
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Verified Database Telemetry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">AI Fitness Coach</h1>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Grounded in Alex's Session History</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[580px] overflow-hidden">
            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role !== 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-cyan-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800/90 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0 text-xs font-bold mt-0.5">
                      A
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                    Consulting progressive overload records and meal history...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Suggested:</span>
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={sending}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap hover:text-cyan-400 transition-colors shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
              <input
                type="text"
                placeholder="Ask about today's workout, your volume trends, PRs, or nutrition..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />

              <button
                onClick={() => handleSend()}
                disabled={sending || !inputMessage.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all flex items-center space-x-1.5"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Medical & Safety Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            *Safety Notice: FitAI provides algorithmic sports science feedback based on recorded metrics. For injuries, pain, diagnosis, or clinical diets, always consult an accredited medical professional.
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
