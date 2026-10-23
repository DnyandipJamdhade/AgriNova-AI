import React from 'react';
import { 
  Sprout, 
  Activity, 
  TrendingUp, 
  Scan, 
  Map, 
  ShoppingBag, 
  Bot, 
  User, 
  Globe,
  Cloud,
  Cpu,
  Award
} from 'lucide-react';
import { ActiveTab, UserPersona } from '../types/agri';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  persona: UserPersona;
  setPersona: (p: UserPersona) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onOpenQuickScan?: () => void;
  onOpenJudgeDossier?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  persona,
  setPersona,
  language,
  setLanguage,
  onOpenQuickScan,
  onOpenJudgeDossier,
}) => {
  const navTabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Command Hub', icon: Sprout },
    { id: 'iot', label: 'AWS IoT Core', icon: Activity },
    { id: 'yield', label: 'Yield Modeling', icon: TrendingUp },
    { id: 'disease', label: 'Vision Pathology', icon: Scan },
    { id: 'gis', label: 'GIS & Drone', icon: Map },
    { id: 'aws_arch', label: 'AWS Cloud Fabric', icon: Cloud },
    { id: 'bedrock', label: 'Bedrock Studio', icon: Cpu },
    { id: 'market', label: 'Value Chain', icon: ShoppingBag },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-400 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Sprout className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            AgriNova <span className="text-emerald-400 font-medium">AI</span>
          </span>
        </div>

        {/* Zone 2: Single-Line Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Selectors */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hackathon Judge Award Button */}
          <button
            onClick={onOpenJudgeDossier}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all whitespace-nowrap shadow-md shadow-amber-500/20 border border-amber-400/40"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hackathon Pitch</span>
            <span className="sm:hidden">Pitch</span>
          </button>

          {/* Persona Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value as UserPersona)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="aws_judge" className="bg-slate-900 text-amber-300 font-bold">AWS Hackathon Judge</option>
              <option value="farmer" className="bg-slate-900 text-slate-200">Precision Grower</option>
              <option value="agronomist" className="bg-slate-900 text-slate-200">Agronomist Scientist</option>
              <option value="government" className="bg-slate-900 text-slate-200">Govt / Scheme Officer</option>
              <option value="buyer" className="bg-slate-900 text-slate-200">Commodity Trader</option>
              <option value="supply_chain" className="bg-slate-900 text-slate-200">Export & Logistics</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-slate-200">English</option>
              <option value="hi" className="bg-slate-900 text-slate-200">हिंदी (Hindi)</option>
              <option value="es" className="bg-slate-900 text-slate-200">Español</option>
              <option value="fr" className="bg-slate-900 text-slate-200">Français</option>
              <option value="sw" className="bg-slate-900 text-slate-200">Kiswahili</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenQuickScan}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Diagnose Leaf</span>
          </button>
        </div>
      </div>

      {/* Secondary Navigation Row for Smaller Screens and XL */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none bg-slate-950">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
