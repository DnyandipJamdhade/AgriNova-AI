import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Droplet, 
  Sun, 
  Wind, 
  Wifi, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Flame,
  Radio,
  Play,
  Zap,
  Cpu
} from 'lucide-react';
import { ActiveTab, IoTZone, UserPersona } from '../types/agri';

interface ExecutiveOverviewProps {
  zones: Record<string, IoTZone>;
  setActiveTab: (tab: ActiveTab) => void;
  persona: UserPersona;
  onSelectZone: (zoneId: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  zones,
  setActiveTab,
  persona,
  onSelectZone,
}) => {
  const zoneList = Object.values(zones);
  const totalArea = zoneList.reduce((acc, z) => acc + z.areaHa, 0).toFixed(1);
  const activePumps = zoneList.filter(z => z.pumpActive).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Agri Status Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Real-Time Farm Telemetry Active</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">LoRaWAN Gateway: Online (14ms latency)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AgriNova Precision Farm Matrix
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Serving continuous sensor telemetry, multi-depth soil matric potential, and biophysical crop yield forecasting for <span className="text-slate-200 font-medium">{totalArea} Hectares</span> under active management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('aws_arch')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>AWS Cloud Fabric</span>
            </button>
            <button
              onClick={() => setActiveTab('bedrock')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Bedrock Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('yield')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Yield Modeling</span>
            </button>
          </div>
        </div>

        {/* Subtle background ambient mesh */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Monitored Acreage */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Managed Land Area</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
              {totalArea}
            </span>
            <span className="text-xs text-slate-400">Hectares (4 Zones)</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% GIS boundary mapped</span>
          </div>
        </div>

        {/* KPI 2: Predictive Yield Forecast */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Projected Biomass Yield</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
              842.6
            </span>
            <span className="text-xs text-slate-400">Tons Aggregate</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+11.4% vs regional baseline</span>
          </div>
        </div>

        {/* KPI 3: Net Revenue Horizon */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Harvest Net Margin Horizon</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
              $284,520
            </span>
            <span className="text-xs text-slate-400">USD Projected</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Average $1,717 / Hectare</span>
          </div>
        </div>

        {/* KPI 4: IoT Infrastructure Health */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>IoT Sensor Nodes</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums tracking-tight">
              32 / 32
            </span>
            <span className="text-xs text-slate-400">Online</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{activePumps} Active irrigation pump{activePumps === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Agrometeorological Live Weather Strip */}
      <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Local Field Weather & Microclimate</span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-emerald-400 font-medium">Optimal Growing Conditions</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-4 mt-0.5">
                <span>Temp: <strong className="text-slate-200">26.2°C</strong></span>
                <span>RH: <strong className="text-slate-200">58%</strong></span>
                <span>Solar: <strong className="text-slate-200">840 W/m²</strong></span>
                <span>ET₀: <strong className="text-slate-200">4.8 mm/day</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
            <div className="space-y-0.5">
              <div className="text-slate-500">GDD Accumulated</div>
              <div className="font-semibold text-slate-200 tabular-nums">1,450 °C-Days</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-slate-500">Rain Prob (48h)</div>
              <div className="font-semibold text-slate-200 tabular-nums">12% (Clear)</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-slate-500">Wind Vector</div>
              <div className="font-semibold text-slate-200 tabular-nums">8.2 km/h NW</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Zones Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Production Parcels</h2>
            <p className="text-xs text-slate-400">Select any parcel to open telemetry, soil chemistry, and actuators</p>
          </div>
          <button
            onClick={() => setActiveTab('iot')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Inspect All Sensors</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zoneList.map((z) => (
            <div
              key={z.id}
              onClick={() => {
                onSelectZone(z.id);
                setActiveTab('iot');
              }}
              className="group cursor-pointer rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 transition-all duration-200 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {z.name}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{z.crop}</span>
                    <span>·</span>
                    <span>{z.areaHa} ha</span>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  z.pumpActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {z.pumpActive ? 'Irrigating' : 'Standby'}
                </span>
              </div>

              {/* Moisture Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Root-zone Moisture</span>
                  <span className="font-semibold text-slate-200 tabular-nums">{z.moisture10cm}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      z.moisture10cm < 25 ? 'bg-amber-400' : z.moisture10cm > 80 ? 'bg-blue-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, z.moisture10cm)}%` }}
                  />
                </div>
              </div>

              {/* Mini Vitals Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">Soil pH</span>
                  <span className="font-semibold text-slate-200 tabular-nums">{z.soilPh}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">EC (dS/m)</span>
                  <span className="font-semibold text-slate-200 tabular-nums">{z.soilEc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">N-P-K</span>
                  <span className="font-semibold text-slate-200 tabular-nums">{z.nitrogen}N</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Intelligence & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agronomic Recommendations */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Prioritized Agronomic Actions</span>
            </h3>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">3 Pending</span>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Zone A Durum Wheat Booting Fertigation</span>
                <span className="text-amber-400 font-medium">Within 24 Hours</span>
              </div>
              <p className="text-xs text-slate-400">
                Nitrogen uptake curve peak expected. Recommended to dose 25 kg/ha potassium sulphate through drip lines to safeguard spikelet fertility.
              </p>
            </div>

            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Zone D Apple Orchard Thermal Misting</span>
                <span className="text-emerald-400 font-medium">Automated Trigger</span>
              </div>
              <p className="text-xs text-slate-400">
                Ultrasonic canopy misting running to moderate vapor pressure deficit (VPD) and protect fruit skin finish.
              </p>
            </div>

            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Carbon Credit Verification Proof Ready</span>
                <span className="text-slate-400">Batch CC-2026-089</span>
              </div>
              <p className="text-xs text-slate-400">
                420.5 tCO2e minted under Verra VCS VM0042 protocol ready for commercial retirement or trade.
              </p>
            </div>
          </div>
        </div>

        {/* Commodity Market Radar */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Commodity Arbitrage & Mandi Ticker</span>
            </h3>
            <button
              onClick={() => setActiveTab('market')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Marketplace →
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
              <div>
                <div className="font-semibold text-white">Durum Milling Wheat</div>
                <div className="text-[11px] text-slate-500">ZW-DEC · Rotterdam Terminal</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white tabular-nums">$294.50 / MT</div>
                <div className="text-emerald-400 font-medium">+3.2% (BULLISH)</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
              <div>
                <div className="font-semibold text-white">Basmati Pusa 1121</div>
                <div className="text-[11px] text-slate-500">RICE-BAS · Dubai DMCC</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white tabular-nums">$512.00 / MT</div>
                <div className="text-emerald-400 font-medium">+1.8% (BULLISH)</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
              <div>
                <div className="font-semibold text-white">Shankar-6 Long Staple Cotton</div>
                <div className="text-[11px] text-slate-500">CT-MAY · Intercontinental (ICE)</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white tabular-nums">$1,140.00 / MT</div>
                <div className="text-emerald-400 font-medium">+5.4% (HIGH DEMAND)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
