import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign, 
  FileText, 
  Award, 
  Boxes,
  Truck,
  ExternalLink
} from 'lucide-react';
import { INITIAL_COMMODITIES, GOVT_SCHEMES, CARBON_CREDIT_BATCHES } from '../data/agriData';
import { CommodityItem, GovtScheme, CarbonCreditBatch } from '../types/agri';

export const MarketplaceChain: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'commodities' | 'schemes' | 'carbon' | 'storage'>('commodities');
  const [commodities] = useState<CommodityItem[]>(INITIAL_COMMODITIES);
  const [appliedScheme, setAppliedScheme] = useState<string | null>(null);
  const [bookedStorage, setBookedStorage] = useState<string | null>(null);

  const warehouses = [
    {
      id: 'wh-01',
      name: 'AgriNova Controlled Atmosphere Cold Hub #4',
      location: 'Amritsar Agro-Logistics Corridor',
      distanceKm: 18.5,
      temperatureC: 2.5,
      humidityPct: 88,
      capacityAvailableMT: 450,
      ratePerMTMonthUSD: 14.5,
    },
    {
      id: 'wh-02',
      name: 'State Grain Silo & Bulk Terminal',
      location: 'Central Rail Head, Ludhiana',
      distanceKm: 34.0,
      temperatureC: 18.0,
      humidityPct: 54,
      capacityAvailableMT: 1200,
      ratePerMTMonthUSD: 8.2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Boxes className="w-3.5 h-3.5" />
              <span>Full Value Chain Integration · Farm to Global Market</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Commodity Trading, Subsidies & Blockchain Carbon Credits
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Arbitrage spot prices across international exchanges, secure government subsidy grants, book climate-controlled cold chain logistics, and mint Verra-compliant carbon offset credits.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('commodities')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'commodities' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Commodity Ticker
            </button>
            <button
              onClick={() => setActiveSubTab('schemes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'schemes' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Govt Schemes
            </button>
            <button
              onClick={() => setActiveSubTab('carbon')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'carbon' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Carbon Credits
            </button>
            <button
              onClick={() => setActiveSubTab('storage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'storage' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cold Storage
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Commodity Ticker & Arbitrage */}
      {activeSubTab === 'commodities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodities.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.symbol}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    item.change24h >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {item.change24h >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
                    ${item.currentPriceUSD.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">/ {item.unit}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>MSP Support Floor:</span>
                    <strong className="text-slate-200 font-mono">${item.mspUSD.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Export Demand:</span>
                    <strong className="text-emerald-400">{item.exportDemand}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Best Liquidity:</span>
                    <strong className="text-slate-200 truncate max-w-[150px]">{item.bestMarket}</strong>
                  </div>
                </div>

                <div className="text-xs text-emerald-400 font-medium flex items-center justify-between pt-1">
                  <span>{item.arbitrageOpportunity}</span>
                  <button className="text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-2.5 py-1 rounded transition-colors">
                    Trade Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Government Scheme AI Matcher */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GOVT_SCHEMES.map((scheme) => (
              <div key={scheme.id} className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {scheme.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{scheme.title}</h3>
                    <div className="text-xs text-slate-400">{scheme.authority}</div>
                  </div>
                  <span className="text-xs font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md shrink-0">
                    {scheme.matchScore}% Match
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-400">Subvention / Incentive:</div>
                  <div className="text-sm font-bold text-emerald-400">{scheme.subsidyAmount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Eligibility: {scheme.eligibilityCriteria}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Deadline: <strong className="text-slate-200">{scheme.deadline}</strong></span>
                  <button
                    onClick={() => setAppliedScheme(scheme.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      appliedScheme === scheme.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {appliedScheme === scheme.id ? 'Eligibility Dossier Auto-Generated' : 'Apply with Farm Data'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Blockchain Carbon Credit Protocol */}
      {activeSubTab === 'carbon' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Verra VCS VM0042 & Gold Standard Agricultural Carbon Registry</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cryptographically verified soil organic carbon (SOC) sequestration from conservation no-till and biochar amendments.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Minted Carbon Yield</span>
                <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                  635.5 tCO₂e
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {CARBON_CREDIT_BATCHES.map((batch) => (
                <div key={batch.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{batch.farmParcel}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {batch.verificationStandard}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{batch.practice}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white tabular-nums">
                        {batch.creditsMintedTCO2e} Credits (${(batch.creditsMintedTCO2e * batch.unitPriceUSD).toLocaleString()})
                      </div>
                      <div className="text-xs text-emerald-400 font-mono">@ ${batch.unitPriceUSD}/tCO2e</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                    <span className="truncate max-w-[280px]">Hash: {batch.verificationHash}</span>
                    <button className="text-emerald-400 hover:text-emerald-300 font-sans font-semibold flex items-center gap-1">
                      <span>View Provenance Cert</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Cold Storage & Warehouse Logistics */}
      {activeSubTab === 'storage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouses.map((wh) => (
              <div key={wh.id} className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{wh.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>{wh.location} ({wh.distanceKm} km away)</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    ${wh.ratePerMTMonthUSD} / MT / mo
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temperature</span>
                    <span className="font-bold text-cyan-400 tabular-nums">{wh.temperatureC}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Relative Humidity</span>
                    <span className="font-bold text-slate-200 tabular-nums">{wh.humidityPct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Available Slot</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{wh.capacityAvailableMT} MT</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookedStorage(wh.id)}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                    bookedStorage === wh.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {bookedStorage === wh.id ? 'Slot Reserved · Automated Telemetry Active' : 'Book Cold Storage Slot'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
