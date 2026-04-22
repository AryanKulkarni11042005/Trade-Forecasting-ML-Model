import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://trade-forecasting-ml-model.onrender.com',
  timeout: 15000,
})

// --- Types ---

export interface DashboardData {
  current_trade_deficit: number
  predicted_trade_deficit: number
  risk: string
  model: string
  oil_price: number
  usd_inr: number
  last_updated: string
}

export interface LiveMarketData {
  usd_inr: number
  oil_price: number
  updated_at: string
}


export interface HistoricalRecord {
  date: string
  trade_deficit: number
  trade_deficit_next?: number
  total_imports?: number
  total_exports?: number
  oil_price: number
  usd_inr: number
  imports_china?: number
  imports_usa?: number
  imports_russia?: number
  exports_china?: number
  exports_usa?: number
  exports_russia?: number
  [key: string]: unknown
}

export interface ForecastChartPoint {
  date: string
  value: number
  trade_deficit?: number
}

export interface ForecastData {
  next_month_forecast: number
  three_month_forecast: number
  six_month_forecast: number
  risk: string
  chart: {
    historical: ForecastChartPoint[]
    forecast: ForecastChartPoint[]
  }
}

export interface FeatureImportanceItem {
  feature: string
  importance: number
}

export interface InsightItem {
  feature: string
  impact: string
  type: 'positive' | 'negative'
}

export interface FeatureImportanceData {
  title: string
  feature_importance: FeatureImportanceItem[]
  insights: InsightItem[]
}

export interface SimulatorInput {
  oil_change: number
  usd_change: number
  china_change: number
  usa_change: number
  russia_change: number
}

export interface SimulatorResult {
  current_prediction: number
  new_prediction: number
  difference: number
  difference_percent: number
}

// --- Service Functions ---

export async function getDashboardData(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/dashboard')
  return data
}

export async function getLiveMarketData(): Promise<LiveMarketData> {
  const { data } = await api.get<LiveMarketData>('/live-market')
  return data
}

export async function getForecastData(): Promise<ForecastData> {
  const { data } = await api.get<ForecastData>('/forecast')
  return data
}

export async function simulateScenario(input: SimulatorInput): Promise<SimulatorResult> {
  const { data } = await api.post<SimulatorResult>('/simulate', input)
  return data
}

export async function getFeatureImportance(): Promise<FeatureImportanceData> {
  const { data } = await api.get<FeatureImportanceData>('/feature-importance')
  return data
}

export async function getHistoricalData(): Promise<HistoricalRecord[]> {
  const { data } = await api.get<HistoricalRecord[]>('/historical-data')
  return data
}
