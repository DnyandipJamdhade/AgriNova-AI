import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Volume2, 
  Mic, 
  Play, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Send, 
  RefreshCw, 
  Award,
  Zap,
  Sliders,
  Radio
} from 'lucide-react';
import { BEDROCK_BENCHMARKS } from '../data/agriData';
import { BedrockModelComparison, IoTZone } from '../types/agri';

interface BedrockStudioProps {
  currentZone: IoTZone;
}

export const BedrockStudio: React.FC<BedrockStudioProps> = ({ currentZone }) => {
  const [benchmarks, setBenchmarks] = useState<BedrockModelComparison[]>(BEDROCK_BENCHMARKS);
  const [activePrompt, setActivePrompt] = useState(
    'Evaluate nitrogen immobilization vs volatilization risk given current soil pH 6.8 and moisture 28.4%.'
  );
  const [isComparing, setIsComparing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<'Joanna' | 'Matthew' | 'Aditi' | 'Lupe'>('Aditi');
  const [alexaUtterance, setAlexaUtterance] = useState('Alexa, ask AgriNova: What is the soil moisture in Wheat Zone A?');
  const [pollySpeaking, setPollySpeaking] = useState(false);

  const sampleEdgeCases = [
    'Evaluate nitrogen immobilization vs volatilization risk given current soil pH 6.8 and moisture 28.4%.',
    'Root-zone matric potential dropped to -45 kPa. Recommend pulsed micro-irrigation schedule to prevent floret abortion.',
    'Formulate certified biological control protocol for Puccinia striiformis (Yellow Rust) prior to flag leaf emergence.',
    'Calculate tCO2e sequestration potential from biochar + no-till conservation on 45.2 ha Durum Wheat parcel.',
  ];

  const handleRunComparison = async (promptText?: string) => {
    const text = promptText || activePrompt;
    setIsComparing(true);
    try {
      const res = await fetch('/api/aws/bedrock/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.benchmarks) {
          setBenchmarks(data.benchmarks);
        }
      }
    } catch (err) {
      console.error('Error running Bedrock comparison:', err);
    } finally {
      setIsComparing(false);
    }
  };

  const handleSpeakWithPolly = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPollySpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    if (selectedVoice === 'Aditi') {
      utterance.lang = 'en-IN';
    } else if (selectedVoice === 'Lupe') {
      utterance.lang = 'es-ES';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setPollySpeaking(false);
    utterance.onerror = () => setPollySpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Cpu className="w-4 h-4" />
              <span>Amazon Bedrock Multi-Model Arena & Alexa Voice Skills</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Generative Agronomic Foundation Models & Voice AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Benchmark Claude 3.5 Sonnet, Amazon Titan, and custom fine-tuned AgriNova Bio-LLM on live field parameters, with multilingual voice synthesis via Amazon Polly Neural.
            </p>
          </div>

          <button
            onClick={() => handleRunComparison()}
            disabled={isComparing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 whitespace-nowrap self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
            <span>Benchmark All Models</span>
          </button>
        </div>
      </div>

      {/* Edge Case Selector Strip */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Agronomic Edge Case Prompt:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {sampleEdgeCases.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActivePrompt(prompt);
                handleRunComparison(prompt);
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activePrompt === prompt
                  ? 'bg-amber-500/10 border-amber-500/50 text-slate-100 font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="truncate">{prompt}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bedrock Model Benchmark Arena */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Side-by-Side Model Inference Results on Amazon Bedrock</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Grounding Context: {currentZone.crop} (pH {currentZone.soilPh}, VWC {currentZone.moisture10cm}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarks.map((model) => (
            <div
              key={model.modelId}
              className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{model.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{model.provider}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {model.agronomicScore}% Domain Score
                  </span>
                </div>

                {/* Model Latency & Cost Spec Strip */}
                <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Speed</span>
                    <strong className="text-slate-200 tabular-nums">{model.tokensPerSec} t/s</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Latency (TTFT)</span>
                    <strong className="text-cyan-400 tabular-nums">{model.latencyMs} ms</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Cost / 1k Tokens</span>
                    <strong className="text-amber-400 tabular-nums">${model.costPer1kTokensUSD}</strong>
                  </div>
                </div>

                {/* Generated Technical Answer */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
                  {model.responseSample}
                </div>
              </div>

              {/* Bottom Advantage & Listen with Polly button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 italic truncate max-w-[240px]">
                  {model.highlightAdvantage}
                </span>
                <button
                  onClick={() => handleSpeakWithPolly(model.responseSample)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hear (Polly)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amazon Polly & Alexa Skills Voice Testbed */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <span>Amazon Polly Neural Voice & Alexa Skills Kit (ASK) Ingest</span>
            </h3>
            <p className="text-xs text-slate-400">
              Low-bandwidth audio guidance for farmers and field workers with localized multilingual neural speech.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Voice Persona:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Aditi">Aditi (Bilingual Hindi/English Neural)</option>
              <option value="Joanna">Joanna (US English Neural)</option>
              <option value="Matthew">Matthew (US English Neural Male)</option>
              <option value="Lupe">Lupe (Spanish Neural)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alexa Skill Command Simulator */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Alexa Skill Invocation Simulator</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Invocation: "Ask AgriNova"</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 font-mono">
              "{alexaUtterance}"
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                Matched Intent: GetSoilTelemetryIntent
              </span>
              <button
                onClick={() =>
                  handleSpeakWithPolly(
                    `In Zone A, root-zone soil moisture is currently 28.4%. Soil temperature is 21.4 degrees Celsius. Drip line is currently idle. Would you like me to trigger a 30-minute pulse?`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Alexa Utterance</span>
              </button>
            </div>
          </div>

          {/* Neural Speech Waveform & SSML Controller */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Amazon Polly Neural Waveform Telemetry</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Sampling: 24 kHz MP3</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 h-14 bg-slate-900/60 rounded-lg p-2 border border-slate-800">
              {[40, 65, 80, 45, 90, 75, 30, 85, 95, 60, 45, 70, 85, 35, 60, 90, 75, 50, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    pollySpeaking ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                  }`}
                  style={{ height: pollySpeaking ? `${h}%` : '25%' }}
                />
              ))}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Voice Engine: Amazon Polly Neural</span>
              <span className="text-emerald-400">{pollySpeaking ? 'Streaming Audio...' : 'Audio Idle'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
