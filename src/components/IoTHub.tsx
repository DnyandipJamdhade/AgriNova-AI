import React, { useState } from 'react';
import { 
  Droplets, 
  Activity, 
  Thermometer, 
  Zap, 
  Wifi, 
  Battery, 
  Power, 
  Sliders, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { IoTZone } from '../types/agri';

interface IoTHubProps {
  zones: Record<string, IoTZone>;
  selectedZoneId: string;
  onSelectZone: (id: string) => void;
  onActuate: (zoneId: string, device: 'pump' | 'misting' | 'fertigation', state: boolean | number) => Promise<void>;
  onRefresh: () => void;
}

export const IoTHub: React.FC<IoTHubProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  onActuate,
  onRefresh,
}) => {
  const currentZone = zones[selectedZoneId] || Object.values(zones)[0];
  const [isActuating, setIsActuating] = useState(false);
  const [fertigationValue, setFertigationValue] = useState(currentZone.fertigationPpm || 120);

  const handleTogglePump = async () => {
    setIsActuating(true);
    await onActuate(selectedZoneId, 'pump', !currentZone.pumpActive);
    setIsActuating(false);
  };

  const handleToggleMisting = async () => {
    setIsActuating(true);
    await onActuate(selectedZoneId, 'misting', !currentZone.mistingActive);
    setIsActuating(false);
  };

  const handleApplyFertigation = async () => {
    setIsActuating(true);
    await onActuate(selectedZoneId, 'fertigation', fertigationValue);
    setIsActuating(false);
  };

  // Soil moisture depth analysis
  const moistureLevels = [
    { depth: '10 cm (Topsoil)', val: currentZone.moisture10cm, optimal: [25, 40] },
    { depth: '30 cm (Primary Rooting)', val: currentZone.moisture30cm, optimal: [28, 45] },
    { depth: '50 cm (Deep Subsoil)', val: currentZone.moisture50cm, optimal: [30, 50] },
  ];

  return (
    <div className="space-y-6">
      {/* Zone Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">AWS IoT Core Wireless & Field Actuators</h2>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-amber-400 font-mono">AWS IoT Core</span>
              <span>·</span>
              <span className="font-mono text-slate-300 truncate max-w-[220px]">Topic: {currentZone.mqttTopic || `agrinova/farm/${currentZone.id}/telemetry`}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Device Shadow: SYNCED</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {Object.values(zones).map((z) => (
              <button
                key={z.id}
                onClick={() => {
                  onSelectZone(z.id);
                  setFertigationValue(z.fertigationPpm);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedZoneId === z.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {z.crop} ({z.id.toUpperCase()})
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            title="Refresh Live Sensor Data"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Zone Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Crop & Parcel</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-bold text-slate-100 text-sm truncate">{currentZone.name}</div>
          <div className="text-xs text-slate-400 tabular-nums">{currentZone.areaHa} Hectares</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Node Battery</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-bold text-slate-100 text-sm tabular-nums">{currentZone.batteryLevel}%</div>
          <div className="text-xs text-emerald-400">Solar harvesting nominal</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Soil Temperature</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-bold text-slate-100 text-sm tabular-nums">{currentZone.soilTemp}°C</div>
          <div className="text-xs text-slate-400">Thermal root-zone optimum</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Solar Flux</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="font-bold text-slate-100 text-sm tabular-nums">{currentZone.solarRadiation} W/m²</div>
          <div className="text-xs text-slate-400">PAR index active</div>
        </div>
      </div>

      {/* Main Grid: Multi-Depth Soil Moisture & Chemistry vs Actuators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Soil Moisture Profile & Nutrient Balances (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-Depth Moisture Tensiometer */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Multi-Depth Soil Moisture Profile</span>
                </h3>
                <p className="text-xs text-slate-400">Volumetric Water Content (VWC %) measured by FDR capacitive probes</p>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">Refreshed: {currentZone.lastUpdate}</span>
            </div>

            <div className="space-y-4 pt-2">
              {moistureLevels.map((lvl, idx) => {
                const isOptimal = lvl.val >= lvl.optimal[0] && lvl.val <= lvl.optimal[1];
                const isDry = lvl.val < lvl.optimal[0];
                return (
                  <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{lvl.depth}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          isOptimal ? 'bg-emerald-500/15 text-emerald-400' :
                          isDry ? 'bg-amber-500/15 text-amber-400' : 'bg-cyan-500/15 text-cyan-400'
                        }`}>
                          {isOptimal ? 'Optimal Range' : isDry ? 'Refill Deficit' : 'Saturated'}
                        </span>
                        <span className="font-bold text-slate-100 tabular-nums text-sm">{lvl.val}%</span>
                      </div>
                    </div>

                    <div className="relative w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDry ? 'bg-amber-400' : lvl.val > 70 ? 'bg-cyan-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, lvl.val)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Wilting Pt: 15%</span>
                      <span>Target Band: {lvl.optimal[0]}% - {lvl.optimal[1]}%</span>
                      <span>Field Cap: 50%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Soil Chemistry (pH, EC, NPK) */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Soil Chemistry & Macronutrients</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* pH Meter */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 block">Soil pH (Reaction)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tabular-nums">{currentZone.soilPh}</span>
                  <span className="text-xs text-emerald-400">Neutral</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-red-500 via-emerald-500 to-purple-500" />
                <span className="text-[10px] text-slate-500 block">Ideal: 6.2 - 7.2</span>
              </div>

              {/* EC Meter */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 block">Salinity EC (dS/m)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tabular-nums">{currentZone.soilEc}</span>
                  <span className="text-xs text-emerald-400">Low Saline</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, (currentZone.soilEc / 3.0) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Threshold &lt; 2.0 dS/m</span>
              </div>

              {/* Available Nitrogen */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 block">Available Nitrate (N)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tabular-nums">{currentZone.nitrogen}</span>
                  <span className="text-xs text-slate-400">mg/kg</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: `${Math.min(100, (currentZone.nitrogen / 250) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Adequate vegetative reserve</span>
              </div>

              {/* Phosphorus */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 block">Phosphorus (P₂O₅)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tabular-nums">{currentZone.phosphorus}</span>
                  <span className="text-xs text-slate-400">mg/kg</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${Math.min(100, (currentZone.phosphorus / 80) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Optimal root development</span>
              </div>

              {/* Potassium */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 block">Potassium (K₂O)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tabular-nums">{currentZone.potassium}</span>
                  <span className="text-xs text-slate-400">mg/kg</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (currentZone.potassium / 300) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Stomatal regulation buffer</span>
              </div>

              {/* Leaf Wetness */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[11px] text-slate-400 block">Leaf Canopy Wetness</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white tabular-nums">{currentZone.leafWetness}%</span>
                  <span className="text-xs text-emerald-400">Dry</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${currentZone.leafWetness}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Low fungal spore germination</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Actuation Command Board (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Field Actuator Controls</span>
              </h3>
              <p className="text-xs text-slate-400">Direct telemetry relays for solenoid valves, VFD pumps & dosing</p>
            </div>

            {/* Actuator 1: Sub-surface Drip Pump */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <Power className={`w-3.5 h-3.5 ${currentZone.pumpActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>Variable Frequency Drip Pump #01</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Operating Pressure: 2.2 Bar · Flow Rate: 18.5 m³/h</p>
                </div>
                <button
                  disabled={isActuating}
                  onClick={handleTogglePump}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentZone.pumpActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                  }`}
                >
                  {currentZone.pumpActive ? 'Halt Irrigation' : 'Engage Drip'}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <span className={`w-2 h-2 rounded-full ${currentZone.pumpActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>Status: {currentZone.pumpActive ? 'Relay Energized · Flow Verified' : 'Standby Mode'}</span>
              </div>
            </div>

            {/* Actuator 2: Canopy Ultrasonic Misting */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <Droplets className={`w-3.5 h-3.5 ${currentZone.mistingActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>Canopy Cooling Misting Line</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">VPD Moderation & Frost / Heat Shielding</p>
                </div>
                <button
                  disabled={isActuating}
                  onClick={handleToggleMisting}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentZone.mistingActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {currentZone.mistingActive ? 'Deactivate Misting' : 'Activate Misting'}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <span className={`w-2 h-2 rounded-full ${currentZone.mistingActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>Microclimate Target: 24°C / 65% RH</span>
              </div>
            </div>

            {/* Actuator 3: Fertigation Venturi Dosing */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" />
                  <span>Automated Fertigation Dosing Rate</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                  {fertigationValue} PPM
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={fertigationValue}
                onChange={(e) => setFertigationValue(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 PPM (Clear Water)</span>
                <span>120 PPM (Vegetative)</span>
                <span>300 PPM (Full Dosing)</span>
              </div>

              <button
                disabled={isActuating}
                onClick={handleApplyFertigation}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Calibrate Venturi Injector ({fertigationValue} PPM)</span>
              </button>
            </div>
          </div>

          {/* LoRaWAN Network Terminal Packet Log */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400 font-sans font-semibold text-xs pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>LoRaWAN Node Diagnostic Packets</span>
              </span>
              <span className="text-[10px] text-emerald-400">FRAME CRC: OK</span>
            </div>
            <div className="text-slate-400 space-y-1 pt-1 max-h-36 overflow-y-auto">
              <div className="text-slate-400">[0.012s] DevEUI: 70B3D57ED0042A91 | Uplink SF7BW125 | RSSI: {currentZone.loraRssi} dBm</div>
              <div className="text-emerald-400/90">[0.014s] Payload decoded: SoilVWC={currentZone.moisture10cm}%, Temp={currentZone.soilTemp}°C, EC={currentZone.soilEc}</div>
              <div className="text-slate-400">[0.018s] Solar Bus: 4.18V, Battery: {currentZone.batteryLevel}%, Charging state: ACTIVE</div>
              <div className="text-slate-500">[0.021s] Downlink ack: 0x01 (ACK_SUCCESS)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
