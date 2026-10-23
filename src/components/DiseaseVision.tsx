import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldAlert, 
  Pill, 
  Leaf, 
  Sparkles, 
  RefreshCw, 
  FileText,
  Camera,
  Activity
} from 'lucide-react';
import { SAMPLE_DISEASE_SPECIMENS, SampleLeafSpecimen } from '../data/agriData';
import { DiseaseDiagnosis } from '../types/agri';

export const DiseaseVision: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SampleLeafSpecimen>(SAMPLE_DISEASE_SPECIMENS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);

  const runDiagnostic = async (sampleId?: string, imageB64?: string) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/ai/disease-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleId: imageB64 ? undefined : (sampleId || selectedSample.id),
          imageBase64: imageB64 || customImage || undefined,
          crop: selectedSample.crop,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data);
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Initial scan on load
  React.useEffect(() => {
    runDiagnostic(SAMPLE_DISEASE_SPECIMENS[0].id);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomImage(result);
        runDiagnostic(undefined, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Scan className="w-3.5 h-3.5" />
              <span>Edge Vision & Multimodal Agronomy Diagnostic</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Plant Pathology & Pest Computer Vision Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Identify foliar pathogens, leaf blights, rusts, and chewing larvae down to the exact Latin binomial classification with actionable chemical and certified organic prescriptions.
            </p>
          </div>

          <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap self-start md:self-auto">
            <Camera className="w-4 h-4" />
            <span>Upload Leaf Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Preset Verified Leaf Specimens Bar */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Verified Field Pathology Specimen:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SAMPLE_DISEASE_SPECIMENS.map((specimen) => (
            <button
              key={specimen.id}
              onClick={() => {
                setCustomImage(null);
                setSelectedSample(specimen);
                runDiagnostic(specimen.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSample.id === specimen.id && !customImage
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold truncate text-slate-100">{specimen.name}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">{specimen.badgeLabel}</div>
              <div className="text-[10px] text-slate-500 mt-1">{specimen.crop} · {specimen.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Arena: Vision Scanner Left (5 cols) vs Pathology Breakdown Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Leaf Inspection Canvas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[360px] flex items-center justify-center p-6">
            {/* Custom Image or Visual SVG Specimen */}
            {customImage ? (
              <img
                src={customImage}
                alt="Uploaded Leaf Specimen"
                referrerPolicy="no-referrer"
                className="max-h-[320px] w-auto rounded-lg object-contain"
              />
            ) : (
              <div className="relative w-full max-w-[280px] h-[300px] flex items-center justify-center">
                {/* SVG Leaf Specimen Graphic */}
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
                  {/* Leaf Stem & Blade */}
                  <path
                    d="M100 20 C140 50 170 110 150 180 C130 220 100 230 100 230 C100 230 70 220 50 180 C30 110 60 50 100 20 Z"
                    fill="#15803d"
                    stroke="#22c55e"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  {/* Central Vein */}
                  <path d="M100 20 Q100 130 100 230" stroke="#86efac" strokeWidth="2.5" fill="none" opacity="0.6" />
                  {/* Side Veins */}
                  <path d="M100 60 Q125 75 140 85" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M100 60 Q75 75 60 85" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M100 110 Q130 130 148 145" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M100 110 Q70 130 52 145" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M100 160 Q125 180 138 195" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.4" />
                  <path d="M100 160 Q75 180 62 195" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.4" />

                  {/* Disease Lesion Spots tailored to specimen */}
                  {selectedSample.id === 'wheat-yellow-rust' && (
                    <>
                      <line x1="85" y1="70" x2="85" y2="150" stroke="#facc15" strokeWidth="5" strokeDasharray="3 3" />
                      <line x1="93" y1="80" x2="93" y2="170" stroke="#eab308" strokeWidth="4" strokeDasharray="2 3" />
                      <line x1="112" y1="75" x2="112" y2="160" stroke="#facc15" strokeWidth="4" strokeDasharray="3 2" />
                    </>
                  )}
                  {selectedSample.id === 'tomato-early-blight' && (
                    <>
                      <circle cx="80" cy="110" r="14" fill="#78350f" opacity="0.9" />
                      <circle cx="80" cy="110" r="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
                      <circle cx="125" cy="140" r="18" fill="#78350f" opacity="0.9" />
                      <circle cx="125" cy="140" r="12" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                    </>
                  )}
                  {selectedSample.id === 'maize-armyworm' && (
                    <>
                      <path d="M90 90 Q110 95 105 120 Q85 110 90 90 Z" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
                      <circle cx="115" cy="105" r="3" fill="#92400e" />
                      <circle cx="98" cy="118" r="2.5" fill="#92400e" />
                    </>
                  )}
                  {selectedSample.id === 'apple-scab' && (
                    <>
                      <ellipse cx="85" cy="100" rx="14" ry="10" fill="#3f2e18" stroke="#1c1917" />
                      <ellipse cx="120" cy="145" rx="16" ry="12" fill="#3f2e18" stroke="#1c1917" />
                    </>
                  )}
                  {selectedSample.id === 'rice-blast' && (
                    <>
                      <ellipse cx="100" cy="95" rx="7" ry="18" fill="#f1f5f9" stroke="#7f1d1d" strokeWidth="2" />
                      <ellipse cx="80" cy="145" rx="6" ry="15" fill="#f1f5f9" stroke="#7f1d1d" strokeWidth="2" />
                    </>
                  )}
                </svg>

                {/* Computer Vision Inference Bounding Box */}
                <div className="absolute inset-x-8 top-16 bottom-16 border-2 border-dashed border-emerald-400 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-emerald-500 text-slate-950 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                      YOLOv11-AGRI · 96.2%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">BBOX_ACTIVE</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono text-right">
                    TARGET: {selectedSample.crop.toUpperCase()}
                  </div>
                </div>
              </div>
            )}

            {/* Scanning animation bar */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent top-0 animate-bounce" />
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Model: YOLOv11 + Gemini 3.8 Vision</span>
            <span className="font-mono text-emerald-400">FPS: 45 · Latency: 22ms</span>
          </div>
        </div>

        {/* Right Column: Diagnostic & Prescriptions */}
        <div className="lg:col-span-7 space-y-4">
          {diagnosis ? (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
              {/* Disease Title & Severity */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{diagnosis.diseaseName}</h3>
                    <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {(diagnosis.confidence * 100).toFixed(1)}% Confidence
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 italic mt-0.5 font-mono">
                    Pathogen: {diagnosis.pathogen}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Severity:</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {diagnosis.severity}
                  </span>
                </div>
              </div>

              {/* Foliar Symptoms */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">Observed Foliar Morphology:</span>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  {diagnosis.symptoms}
                </p>
              </div>

              {/* Treatment Protocols (Dual Chemical & Organic) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Protocol 1: Chemical Curative */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Pill className="w-4 h-4" />
                    <span>Targeted Chemical Curative</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {diagnosis.treatmentChem}
                  </p>
                </div>

                {/* Protocol 2: Biological & Organic */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Leaf className="w-4 h-4" />
                    <span>Certified Organic Bio-Control</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {diagnosis.treatmentBio}
                  </p>
                </div>
              </div>

              {/* Cultural Prevention & Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Agronomic Cultural Prevention:</span>
                  <p className="text-slate-300">{diagnosis.prevention}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Yield Impact if Untreated:</span>
                  <p className="text-rose-400 font-medium">{diagnosis.harvestImpactEstimate}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-400 mb-2" />
              <p className="text-sm">Running convolutional vision diagnostic...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
