import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sliders, 
  Droplet, 
  Sparkles, 
  DollarSign, 
  AlertTriangle, 
  Layers, 
  Flame, 
  CheckCircle2, 
  RefreshCw, 
  Download,
  Calendar,
  Cpu
} from 'lucide-react';
import { IoTZone, YieldModelResult } from '../types/agri';

interface YieldPredictorProps {
  zones: Record<string, IoTZone>;
  selectedZoneId: string;
}

export const YieldPredictor: React.FC<YieldPredictorProps> = ({
  zones,
  selectedZoneId,
}) => {
  const currentZone = zones[selectedZoneId] || Object.values(zones)[0];

  const [crop, setCrop] = useState(currentZone.crop || 'Wheat');
  const [irrigationAdj, setIrrigationAdj] = useState(0); // -30 to +30%
  const [fertilizerAdj, setFertilizerAdj] = useState(0); // -30 to +30%
  const [ndviValue, setNdviValue] = useState(0.74);
  const [heatWaveScenario, setHeatWaveScenario] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [modelResult, setModelResult] = useState<YieldModelResult | null>(null);

  // Sync crop if selected zone changes
  useEffect(() => {
    if (currentZone && currentZone.crop) {
      setCrop(currentZone.crop);
    }
  }, [selectedZoneId, currentZone]);

  const runPrediction = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/ai/yield-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          zoneId: selectedZoneId,
          irrigationAdj,
          fertilizerAdj,
          ndvi: ndviValue,
          heatWaveScenario,
          soilMoisture: currentZone.moisture10cm,
          soilPh: currentZone.soilPh,
          soilEc: currentZone.soilEc,
          nitrogen: currentZone.nitrogen,
          phosphorus: currentZone.phosphorus,
          potassium: currentZone.potassium,
          gdd: 1450,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setModelResult(data);
      }
    } catch (err) {
      console.error('Error calculating yield:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Run on initial mount or when key inputs change
  useEffect(() => {
    runPrediction();
  }, [crop, irrigationAdj, fertilizerAdj, ndviValue, heatWaveScenario]);

  return (
    <div className="space-y-6">
      {/* Engine Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Biophysical AI Engine · FAO-56 + Liebig NPK Fusion</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Predictive Crop Yield & Harvest Modeling
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Fuses real-time root-zone sensor telemetry (Moisture, pH, EC, NPK) with multispectral satellite NDVI and Growing Degree Days (GDD) to predict marketable biomass and economic returns.
            </p>
          </div>

          <button
            onClick={runPrediction}
            disabled={isCalculating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>Recalibrate Model</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameter Controls (Left 5 cols) vs Prediction Output (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulation Sliders */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Simulation Levers</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Zone: {currentZone.id.toUpperCase()}</span>
            </div>

            {/* Target Crop Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Target Crop Variety</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Wheat">Precision Durum Milling Wheat</option>
                <option value="Basmati Rice">Organic Basmati Pusa 1121</option>
                <option value="Hybrid Maize">High-Yield Hybrid Dent Corn / Maize</option>
                <option value="Apple">High-Density Gala / Fuji Apple</option>
                <option value="Cotton">Shankar-6 Long Staple Cotton</option>
                <option value="Soybean">Certified Non-GMO Soybean</option>
              </select>
            </div>

            {/* Live Sensor Ingest Indicator */}
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Ingested Telemetry Stream</span>
                <span className="text-emerald-400 font-mono">LIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                <div>Moisture: <strong className="text-white tabular-nums">{currentZone.moisture10cm}%</strong></div>
                <div>pH: <strong className="text-white tabular-nums">{currentZone.soilPh}</strong></div>
                <div>EC: <strong className="text-white tabular-nums">{currentZone.soilEc} dS/m</strong></div>
              </div>
            </div>

            {/* Slider 1: Irrigation Adjustment */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Irrigation Scheduling Delta</span>
                <span className={`font-mono font-bold tabular-nums ${
                  irrigationAdj > 0 ? 'text-cyan-400' : irrigationAdj < 0 ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {irrigationAdj > 0 ? `+${irrigationAdj}%` : `${irrigationAdj}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={irrigationAdj}
                onChange={(e) => setIrrigationAdj(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-30% (Deficit)</span>
                <span>0% (Telemetry Nominal)</span>
                <span>+30% (Surplus)</span>
              </div>
            </div>

            {/* Slider 2: Fertigation / Nitrogen Tuning */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Fertigation NPK Enrichment</span>
                <span className={`font-mono font-bold tabular-nums ${
                  fertilizerAdj > 0 ? 'text-emerald-400' : fertilizerAdj < 0 ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {fertilizerAdj > 0 ? `+${fertilizerAdj}%` : `${fertilizerAdj}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={fertilizerAdj}
                onChange={(e) => setFertilizerAdj(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-30% (Organic Lean)</span>
                <span>0% (Soil Base)</span>
                <span>+30% (Max Boost)</span>
              </div>
            </div>

            {/* Slider 3: Satellite NDVI Canopy Index */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Sentinel-2 NDVI Canopy Vigor</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  {ndviValue.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.35"
                max="0.95"
                step="0.01"
                value={ndviValue}
                onChange={(e) => setNdviValue(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.35 (Sparse)</span>
                <span>0.74 (Healthy Peak)</span>
                <span>0.95 (Ultra Dense)</span>
              </div>
            </div>

            {/* Climate Scenario Toggle */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer"
                onClick={() => setHeatWaveScenario(!heatWaveScenario)}
              >
                <div className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${heatWaveScenario ? 'text-rose-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Stress Test: Extreme Heatwave</div>
                    <div className="text-[10px] text-slate-400">+3.5°C over historical mean during grain filling</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={heatWaveScenario}
                  onChange={() => {}}
                  className="accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Outcomes & Economics (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {modelResult ? (
            <>
              {/* Primary Yield Metric Card */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Predictive Yield Forecast
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                        {modelResult.predictedYield}
                      </span>
                      <span className="text-base text-slate-400 font-medium">Tons / Hectare</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        modelResult.yieldDeltaPercent >= 0 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {modelResult.yieldDeltaPercent >= 0 ? `+${modelResult.yieldDeltaPercent}%` : `${modelResult.yieldDeltaPercent}%`} vs Baseline
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">95% Confidence Bounds</span>
                    <span className="text-xs font-mono font-semibold text-slate-300 tabular-nums">
                      {modelResult.confidenceMin} — {modelResult.confidenceMax} t/ha
                    </span>
                  </div>
                </div>

                {/* Limiting Factor Callout */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center gap-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400">Primary Agronomic Constraint: </span>
                    <strong className="text-slate-200">{modelResult.limitingFactor}</strong>
                  </div>
                </div>

                {/* Sub-Indices Progress Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Water Index</span>
                    <span className="text-sm font-bold text-cyan-400 tabular-nums">
                      {(modelResult.metrics.waterStressIndex * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">NPK Availability</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">
                      {(modelResult.metrics.nutrientAvailabilityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">pH Bio-Buffer</span>
                    <span className="text-sm font-bold text-teal-400 tabular-nums">
                      {(modelResult.metrics.soilPhPenalty * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">NDVI Biomass</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">
                      {(modelResult.metrics.ndviBiomassIndex * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Return on Harvest Projection */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Economic Return per Hectare</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Benchmark: ${modelResult.economics.pricePerTon}/ton
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-0.5">
                    <span className="text-[11px] text-slate-400 block">Gross Revenue</span>
                    <span className="text-lg font-bold text-slate-100 tabular-nums">
                      ${modelResult.economics.grossRevenueHa.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-0.5">
                    <span className="text-[11px] text-slate-400 block">Production Cost</span>
                    <span className="text-lg font-bold text-slate-300 tabular-nums">
                      ${modelResult.economics.productionCostHa.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-0.5">
                    <span className="text-[11px] text-emerald-400 block font-medium">Net Profit</span>
                    <span className="text-lg font-bold text-emerald-400 tabular-nums">
                      ${modelResult.economics.netProfitHa.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini AI Agronomic Synthesis */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    AI Agronomic Strategy & Optimization Prescription
                  </h3>
                </div>

                <div className="text-xs text-slate-300 space-y-2 whitespace-pre-line leading-relaxed p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  {modelResult.aiRecommendations}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-400 mb-2" />
              <p className="text-sm">Executing biophysical yield modeling equations...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
