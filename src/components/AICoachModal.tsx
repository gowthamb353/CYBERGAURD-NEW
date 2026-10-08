import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, X, Send, Sparkles, ShieldAlert, Lightbulb, HelpCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario?: any; // Scenario context if user is playing a game
}

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose, activeScenario }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'coach',
      text: 'Greetings Guardian. I am your AI Cyber Coach. Ask for tactical hints or defensive safety rules at any time.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string, mode: 'hint' | 'explain' | 'tip' = 'hint') => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setErrorMsg(null);
    setInput('');
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.askAICoach({
        message: query,
        challengeContext: activeScenario || null,
        userLanguage: i18n.language || 'en',
        mode,
      });

      const coachMsg: Message = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: res.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || t('coach.rateLimit'));
      const fallbackMsg: Message = {
        id: `c_err_${Date.now()}`,
        sender: 'coach',
        text: 'Adviser telemetry is undergoing high demand. Remember: Check sender domain legitimacy, beware artificial panic, and never share OTPs or credentials.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (mode: 'hint' | 'explain' | 'tip') => {
    if (mode === 'hint') {
      handleSend('Give me a subtle tactical hint on what anomalies to inspect in this situation.', 'hint');
    } else if (mode === 'explain') {
      handleSend('Can you explain the core defensive principle behind this scenario?', 'explain');
    } else if (mode === 'tip') {
      handleSend('What is the number one golden safety rule for defending against this threat vector?', 'tip');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg cyber-glass-glow rounded-2xl bg-[#081220]/95 border border-cyan-500/40 shadow-2xl flex flex-col h-[560px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-cyan-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>{t('coach.title')}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  Gemini 3.8
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t('coach.online')}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action buttons */}
        <div className="px-4 py-2 border-b border-cyan-500/10 bg-slate-900/40 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => handleQuickAction('hint')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 shrink-0 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('coach.hint')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('explain')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 shrink-0 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('coach.explain')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('tip')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 shrink-0 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('coach.safetyTip')}</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeScenario && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-cyan-300">Active Mission Drill: </span>
                <span>Adviser is monitoring the current scenario. Ready to provide tactical threat cues.</span>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-800/80 text-slate-100 border border-cyan-500/20 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 px-1 mt-1 font-mono">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-cyan-500/20 max-w-[70%]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-xs text-cyan-300 ml-1">{t('coach.thinking')}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-cyan-500/20 bg-slate-900/60 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('coach.placeholder')}
            disabled={loading}
            maxLength={500}
            className="flex-1 bg-slate-950/70 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('coach.send')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
