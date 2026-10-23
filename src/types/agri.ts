export type UserPersona = 
  | 'farmer' 
  | 'agronomist' 
  | 'government' 
  | 'buyer' 
  | 'supply_chain'
  | 'aws_judge';

export type ActiveTab = 
  | 'overview' 
  | 'iot' 
  | 'yield' 
  | 'disease' 
  | 'gis' 
  | 'aws_arch'
  | 'bedrock'
  | 'market' 
  | 'copilot';

export interface IoTDeviceShadow {
  state: {
    desired: {
      pump: boolean;
      misting: boolean;
      fertigationPpm: number;
      targetMoisture: number;
    };
    reported: {
      pump: boolean;
      misting: boolean;
      fertigationPpm: number;
      moisture10cm: number;
    };
    delta: Record<string, any>;
  };
  metadata: {
    desired: Record<string, { timestamp: number }>;
    reported: Record<string, { timestamp: number }>;
  };
  version: number;
  timestamp: number;
}

export interface IoTZone {
  id: string;
  name: string;
  crop: string;
  areaHa: number;
  moisture10cm: number;
  moisture30cm: number;
  moisture50cm: number;
  soilTemp: number;
  soilPh: number;
  soilEc: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ambientTemp: number;
  ambientHumidity: number;
  leafWetness: number;
  solarRadiation: number;
  batteryLevel: number;
  loraRssi: number;
  pumpActive: boolean;
  mistingActive: boolean;
  fertigationPpm: number;
  lastUpdate: string;
  mqttTopic: string;
  deviceShadow: IoTDeviceShadow;
}

export interface YieldModelResult {
  crop: string;
  zoneId: string;
  predictedYield: number;
  baselineYield: number;
  yieldDeltaPercent: number;
  confidenceMin: number;
  confidenceMax: number;
  limitingFactor: string;
  metrics: {
    waterStressIndex: number;
    nutrientAvailabilityScore: number;
    soilPhPenalty: number;
    ndviBiomassIndex: number;
  };
  economics: {
    pricePerTon: number;
    grossRevenueHa: number;
    productionCostHa: number;
    netProfitHa: number;
    currency: string;
  };
  aiRecommendations: string;
}

export interface DiseaseDiagnosis {
  source: string;
  diseaseName: string;
  pathogen: string;
  severity: string;
  confidence: number;
  affectedAreaPercent: number;
  symptoms: string;
  treatmentChem: string;
  treatmentBio: string;
  prevention: string;
  harvestImpactEstimate: string;
  sagemakerModelArn?: string;
  edgeInferenceLatencyMs?: number;
}

export interface CommodityItem {
  id: string;
  name: string;
  symbol: string;
  currentPriceUSD: number;
  unit: string;
  change24h: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  mspUSD: number;
  exportDemand: string;
  bestMarket: string;
  arbitrageOpportunity: string;
  weeklyTrend: number[];
}

export interface DroneMission {
  id: string;
  name: string;
  targetZone: string;
  altitudeMeters: number;
  batteryRequiredPercent: number;
  coverageHectares: number;
  flightTimeMinutes: number;
  status: 'Ready' | 'In Flight' | 'Completed' | 'Analyzing';
  payload: 'Multispectral NDVI' | 'Thermal IR' | 'Precision Spray 16L' | 'RGB 4K Orthomosaic';
}

export interface GovtScheme {
  id: string;
  title: string;
  authority: string;
  subsidyAmount: string;
  deadline: string;
  matchScore: number;
  eligibilityCriteria: string;
  category: 'Irrigation' | 'Solar' | 'Crop Insurance' | 'Fertilizer Subvention' | 'Carbon Credit';
}

export interface CarbonCreditBatch {
  id: string;
  farmParcel: string;
  practice: string;
  creditsMintedTCO2e: number;
  unitPriceUSD: number;
  verificationStandard: 'Verra VCS (VM0042)' | 'Gold Standard' | 'CarbFix Registry';
  verificationHash: string;
  timestamp: string;
  qldbLedgerBlock?: string;
}

export interface AwsServiceNode {
  id: string;
  name: string;
  category: 'IoT & Edge' | 'AI & ML' | 'Serverless & Compute' | 'Data & Storage' | 'Voice & Satellite';
  awsIconName: string;
  roleInAgriNova: string;
  metrics: string;
  sla: string;
  status: 'ACTIVE' | 'SCALING_AUTO' | 'OPTIMIZED';
}

export interface BedrockModelComparison {
  modelId: string;
  name: string;
  provider: string;
  tokensPerSec: number;
  latencyMs: number;
  costPer1kTokensUSD: number;
  agronomicScore: number;
  responseSample: string;
  highlightAdvantage: string;
}
