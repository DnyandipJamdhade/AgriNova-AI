import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Layers, 
  Compass, 
  Send, 
  Battery, 
  ShieldCheck, 
  Play, 
  Square, 
  CheckCircle2, 
  Activity,
  Wind,
  Navigation
} from 'lucide-react';
import { DRONE_MISSIONS } from '../data/agriData';
import { DroneMission } from '../types/agri';

export const GisDroneMap: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'ndwi' | 'satellite' | 'thermal'>('ndvi');
  const [selectedParcel, setSelectedParcel] = useState<string>('zone-a');
  const [activeMission, setActiveMission] = useState<DroneMission>(DRONE_MISSIONS[0]);
  const [isFlightActive, setIsFlightActive] = useState<boolean>(false);
  const [flightProgress, setFlightProgress] = useState<number>(0);

  // Drone flight animation loop
  useEffect(() => {
    let timer: any;
    if (isFlightActive) {
      timer = setInterval(() => {
        setFlightProgress((prev) => {
          if (prev >= 100) {
            setIsFlightActive(false);
            return 100;
          }
          return prev + 5;
        });
      }, 600);
    }
    return () => clearInterval(timer);
  }, [isFlightActive]);

  const handleStartMission = () => {
    setFlightProgress(0);
    setIsFlightActive(true);
  };

  const handleAbortMission = () => {
    setIsFlightActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Navigation className="w-3.5 h-3.5" />
              <span>GIS Precision Spatial Engine · Sentinel-2 + RTK Drone Ingest</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive GIS Farm Matrix & Autonomous Drone Ops
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Survey 165.7 hectares with 10-meter Sentinel-2 multispectral vegetation indices and centimeter-accurate RTK autonomous drone scouting paths.
            </p>
          </div>

          {/* Layer Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeLayer === 'ndvi' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NDVI Vigor
            </button>
            <button
              onClick={() => setActiveLayer('ndwi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeLayer === 'ndwi' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NDWI Water
            </button>
            <button
              onClick={() => setActiveLayer('thermal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeLayer === 'thermal' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thermal IR
            </button>
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeLayer === 'satellite' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RGB Sat
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (8 cols) vs Mission Planner (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive GIS Farm Map */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[460px] p-6 flex flex-col justify-between">
            {/* Top Overlay Legend */}
            <div className="flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-200">Coords: 31°14'22" N, 75°46'18" E</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Elevation: 412m ASL</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                <span className="text-slate-400">Active Layer:</span>
                <span className="font-bold text-white uppercase">{activeLayer}</span>
              </div>
            </div>

            {/* SVG Interactive Geospatial Field Vector Map */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <svg viewBox="0 0 800 500" className="w-full h-full max-h-[440px]">
                {/* Background Grid Lines simulating Satellite coordinate grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                  {/* Layer Gradients */}
                  <linearGradient id="ndviGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#15803d" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="ndviGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#166534" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#15803d" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="ndwiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="thermalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b45309" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Parcel Polygons */}
                {/* Parcel 1: Zone A (Wheat) */}
                <g 
                  onClick={() => setSelectedParcel('zone-a')}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                >
                  <polygon
                    points="80,70 340,90 310,260 60,230"
                    fill={activeLayer === 'ndvi' ? 'url(#ndviGradA)' : activeLayer === 'ndwi' ? 'url(#ndwiGrad)' : activeLayer === 'thermal' ? 'url(#thermalGrad)' : '#334155'}
                    stroke={selectedParcel === 'zone-a' ? '#38bdf8' : '#475569'}
                    strokeWidth={selectedParcel === 'zone-a' ? '3' : '1.5'}
                  />
                  <text x="180" y="165" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ZONE A · Wheat (45.2 ha)
                  </text>
                  <text x="180" y="185" fill="#e2e8f0" fontSize="11" textAnchor="middle">
                    NDVI: 0.74 · Soil VWC: 28.4%
                  </text>
                </g>

                {/* Parcel 2: Zone B (Basmati Rice) */}
                <g 
                  onClick={() => setSelectedParcel('zone-b')}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                >
                  <polygon
                    points="360,80 720,60 740,240 330,250"
                    fill={activeLayer === 'ndvi' ? 'url(#ndviGradB)' : activeLayer === 'ndwi' ? 'url(#ndwiGrad)' : activeLayer === 'thermal' ? 'url(#thermalGrad)' : '#1e293b'}
                    stroke={selectedParcel === 'zone-b' ? '#38bdf8' : '#475569'}
                    strokeWidth={selectedParcel === 'zone-b' ? '3' : '1.5'}
                  />
                  <text x="540" y="155" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ZONE B · Basmati Paddy (60.0 ha)
                  </text>
                  <text x="540" y="175" fill="#e2e8f0" fontSize="11" textAnchor="middle">
                    NDVI: 0.82 · Soil VWC: 82.5%
                  </text>
                </g>

                {/* Parcel 3: Zone C (Maize) */}
                <g 
                  onClick={() => setSelectedParcel('zone-c')}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                >
                  <polygon
                    points="60,260 380,280 350,440 40,410"
                    fill={activeLayer === 'ndvi' ? 'url(#ndviGradA)' : activeLayer === 'ndwi' ? 'url(#ndwiGrad)' : activeLayer === 'thermal' ? 'url(#thermalGrad)' : '#334155'}
                    stroke={selectedParcel === 'zone-c' ? '#38bdf8' : '#475569'}
                    strokeWidth={selectedParcel === 'zone-c' ? '3' : '1.5'}
                  />
                  <text x="190" y="355" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ZONE C · Drip Maize (38.5 ha)
                  </text>
                  <text x="190" y="375" fill="#e2e8f0" fontSize="11" textAnchor="middle">
                    NDVI: 0.78 · Soil VWC: 34.2%
                  </text>
                </g>

                {/* Parcel 4: Zone D (Apple Orchard) */}
                <g 
                  onClick={() => setSelectedParcel('zone-d')}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                >
                  <polygon
                    points="400,270 730,260 700,450 370,430"
                    fill={activeLayer === 'ndvi' ? 'url(#ndviGradB)' : activeLayer === 'ndwi' ? 'url(#ndwiGrad)' : activeLayer === 'thermal' ? 'url(#thermalGrad)' : '#1e293b'}
                    stroke={selectedParcel === 'zone-d' ? '#38bdf8' : '#475569'}
                    strokeWidth={selectedParcel === 'zone-d' ? '3' : '1.5'}
                  />
                  <text x="540" y="355" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    ZONE D · Orchard (22.0 ha)
                  </text>
                  <text x="540" y="375" fill="#e2e8f0" fontSize="11" textAnchor="middle">
                    NDVI: 0.71 · Soil VWC: 31.0%
                  </text>
                </g>

                {/* Drone Flight Path Waypoints (Animated) */}
                {isFlightActive && (
                  <>
                    <path
                      d="M 100 100 L 300 110 L 290 190 L 110 180 L 120 220"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    {/* Drone Marker */}
                    <circle
                      cx={100 + (flightProgress / 100) * 190}
                      cy={100 + (flightProgress / 100) * 80}
                      r="9"
                      fill="#38bdf8"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Bottom Geospatial Info Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs z-10 pt-4">
              <div className="flex items-center gap-4 text-slate-400">
                <span>Selected: <strong className="text-white uppercase">{selectedParcel}</strong></span>
                <span>Drainage Slope: <strong className="text-slate-200">1.4% SW</strong></span>
                <span>Perimeter: <strong className="text-slate-200">2,840m</strong></span>
              </div>

              {/* Color Ramp Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">0.0 (Stress)</span>
                <div className={`w-28 h-2 rounded-full ${
                  activeLayer === 'ndvi' ? 'bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500' :
                  activeLayer === 'ndwi' ? 'bg-gradient-to-r from-amber-400 to-cyan-400' :
                  activeLayer === 'thermal' ? 'bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600' : 'bg-slate-700'
                }`} />
                <span className="text-[10px] text-slate-500 font-mono">1.0 (Vigor)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Autonomous Drone Mission Planner */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Drone Flight Missions</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                DJI AGRAS T50 · RTK
              </span>
            </div>

            {/* Mission Selector */}
            <div className="space-y-2">
              {DRONE_MISSIONS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveMission(m)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeMission.id === m.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start text-xs font-bold text-slate-100">
                    <span>{m.name}</span>
                    <span className="font-mono text-emerald-400 text-[10px]">{m.payload}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>Alt: {m.altitudeMeters}m</span>
                    <span>·</span>
                    <span>Flight: {m.flightTimeMinutes}m</span>
                    <span>·</span>
                    <span>Battery: {m.batteryRequiredPercent}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Flight Execution Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Mission Status:</span>
                <span className={`font-semibold ${isFlightActive ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {isFlightActive ? `In Flight (${flightProgress}%)` : 'Ready on Launch Pad'}
                </span>
              </div>

              {/* Flight Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${flightProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 font-mono">
                <div>Airspeed: <strong className="text-slate-200">12.4 m/s</strong></div>
                <div>Gimbal Pitch: <strong className="text-slate-200">-90° Nadir</strong></div>
                <div>Coverage: <strong className="text-slate-200">{activeMission.coverageHectares} ha</strong></div>
                <div>Overlap: <strong className="text-slate-200">80% / 75%</strong></div>
              </div>

              <div className="pt-2">
                {isFlightActive ? (
                  <button
                    onClick={handleAbortMission}
                    className="w-full py-2.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs hover:bg-rose-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Emergency RTH (Return to Home)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartMission}
                    className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute Autonomous Mission</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
