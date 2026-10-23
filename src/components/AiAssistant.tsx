import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  CheckCircle2, 
  User, 
  Sprout,
  HelpCircle
} from 'lucide-react';
import { IoTZone } from '../types/agri';

interface AiAssistantProps {
  currentZone: IoTZone;
  language: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  currentZone,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Welcome to **AgriNova AI Copilot**. I am grounded in your live farm telemetry for **${currentZone.name}** (Moisture: ${currentZone.moisture10cm}%, pH: ${currentZone.soilPh}, EC: ${currentZone.soilEc} dS/m).\n\nAsk me anything regarding soil nutrition, deficit irrigation scheduling, pest biocontrol, or carbon credit certification.`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const presetPrompts = [
    'Recommend NPK split fertigation for the current growth stage.',
    'How do I calibrate irrigation to prevent root hypoxia?',
    'What are the requirements to mint Verra VM0042 carbon credits?',
    'Evaluate export price arbitrage for Durum Wheat vs local Mandi.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          farmContext: {
            crop: currentZone.crop,
            area: `${currentZone.areaHa} ha`,
            moisture: `${currentZone.moisture10cm}%`,
            ph: currentZone.soilPh,
            ec: `${currentZone.soilEc} dS/m`,
            weather: `Temp: ${currentZone.ambientTemp}°C, RH: ${currentZone.ambientHumidity}%`,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.reply || 'No response returned.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Optional browser speech synthesis if active
        if (speechSynthesisActive && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.reply.replace(/[*#]/g, ''));
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error('Advisor error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      // Simulate listening and triggering a preset voice query
      setTimeout(() => {
        setIsVoiceActive(false);
        handleSend("What is the optimal water tension for the wheat root-zone right now?");
      }, 3500);
    } else {
      setIsVoiceActive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Bot className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash Agronomy Agent · Multilingual & Telemetry-Aware</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AgriNova AI Omniscient Copilot
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              An enterprise agronomist, crop physiologist, and market analyst connected in real-time to your soil chemistry and climatic models.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setSpeechSynthesisActive(!speechSynthesisActive)}
              className={`p-2 rounded-lg border transition-colors ${
                speechSynthesisActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Audio Speech Output"
            >
              {speechSynthesisActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVoiceMode}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                isVoiceActive
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
              }`}
            >
              {isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isVoiceActive ? 'Listening to voice...' : 'Voice Assistant'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Prompts Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 shrink-0 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Quick Inquiries:</span>
        </span>
        {presetPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-6 flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-medium'
                      : 'bg-slate-950/80 text-slate-200 border border-slate-800/80 whitespace-pre-line'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      isUser ? 'text-slate-900/70 text-right' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 text-slate-400 border border-slate-800 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Formulating agronomic solution from soil parameters...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Form Bar */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask AgriNova regarding ${currentZone.crop}, soil chemistry, irrigation, or market prices...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 transition-all font-bold shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
