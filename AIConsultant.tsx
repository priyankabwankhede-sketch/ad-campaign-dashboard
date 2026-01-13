
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { chatWithPlanner } from '../services/geminiService';
import { Campaign } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIConsultantProps {
  campaigns: Campaign[];
}

const AIConsultant: React.FC<AIConsultantProps> = ({ campaigns }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your AdFlow AI Consultant. I have access to your current portfolio. How can I help you optimize your media plan today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const aiResponse = await chatWithPlanner(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', content: aiResponse || "I encountered an error processing that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Media Planning AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-500 font-medium">System Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">GEMINI 3 PRO</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-4 bg-slate-100 rounded-2xl rounded-tl-none border border-slate-200">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about inventory, budgeting, or campaign ROI..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-3 text-center">
          AI-generated advice should be verified with your regional media lead.
        </p>
      </div>
    </div>
  );
};

export default AIConsultant;
