/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CityName =
  | 'All Cities'
  | 'Tokyo'
  | 'London'
  | 'Paris'
  | 'New York'
  | 'Sydney'
  | 'Barcelona'
  | 'Berlin'
  | 'Rome'
  | 'Amsterdam'
  | 'Los Angeles'
  | 'Toronto'
  | 'Dubai'
  | 'Lisbon'
  | 'Miami'
  | 'Seoul';

export type TimeRange = '30D' | '90D' | '6M' | '1Y' | '2Y';
export type ForecastHorizon = '30 Days' | '90 Days' | '6 Months' | '1 Year';
export type MLModelType = 'Prophet' | 'XGBoost' | 'Hybrid Ensemble';

export interface KPISummary {
  totalRevenue: number;
  revenueGrowthYoY: number;
  avgRevenuePerProperty: number;
  avgOccupancyRate: number;
  occupancyGrowthYoY: number;
  avgRating: number;
  avgNightlyPrice: number;
  priceGrowthYoY: number;
  totalBookings: number;
  cancellationRate: number;
}

export interface CityPerformance {
  id: string;
  city: CityName;
  country: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East';
  totalRevenue: number;
  revenueGrowth: number;
  avgOccupancy: number;
  avgNightlyPrice: number;
  avgRating: number;
  activeProperties: number;
  competitionIndex: number; // 0-100
  roi: number; // Percentage annual ROI
  riskLevel: 'Low' | 'Moderate' | 'High';
  investmentRecommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Overvalued';
  lat: number;
  lng: number;
}

export interface MonthlyTrendPoint {
  month: string;
  date: string;
  revenue: number;
  revenuePriorYear: number;
  occupancy: number;
  bookings: number;
  cancellations: number;
  cancellationRate: number;
  avgPrice: number;
}

export interface ForecastDataPoint {
  date: string;
  actualRevenue: number | null;
  forecastRevenue: number;
  lowerBound95: number;
  upperBound95: number;
  trend: number;
  seasonality: number;
  isForecast: boolean;
}

export interface PropertyPricingRecommendation {
  id: string;
  propertyName: string;
  city: CityName;
  neighborhood: string;
  propertyType: 'Entire Loft' | 'Luxury Penthouse' | 'Beachfront Villa' | 'Boutique Condo' | 'Historic Suite';
  currentPrice: number;
  suggestedPrice: number;
  expectedRevenueIncreasePct: number;
  currentOccupancyPct: number;
  expectedOccupancyPct: number;
  reason: string;
  demandScore: number; // 0 - 100
  competitorAvgPrice: number;
  priceElasticity: number; // e.g. -0.42
}

export interface HostScoreCard {
  id: string;
  hostName: string;
  city: CityName;
  listingCount: number;
  overallScore: number; // 0 - 100
  classification: 'Excellent' | 'Good' | 'Average' | 'Poor';
  revenueScore: number; // 25% weight
  occupancyScore: number; // 20% weight
  reviewScore: number; // 25% weight
  responseTimeScore: number; // 15% weight
  cancellationScore: number; // 15% weight
  avgResponseMinutes: number;
  cancellationRatePct: number;
  annualRevenue: number;
  avgRating: number;
  superhostStatus: boolean;
}

export interface ReviewNLPAnalytics {
  sentimentSummary: {
    positivePct: number;
    neutralPct: number;
    negativePct: number;
    totalReviewsAnalyzed: number;
  };
  mostCommonComplaints: {
    issue: string;
    mentions: number;
    pctOfNegative: number;
    revenueImpactEst: number; // USD
    category: 'Cleanliness' | 'Check-in' | 'Noise' | 'Amenities' | 'Accuracy';
  }[];
  mostCommonCompliments: {
    praise: string;
    mentions: number;
    pctOfPositive: number;
    category: 'Location' | 'Host Hospitality' | 'Cleanliness' | 'Comfort' | 'Value';
  }[];
  keywordFrequency: {
    word: string;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  sampleReviews: {
    id: string;
    propertyName: string;
    city: CityName;
    date: string;
    rating: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    comment: string;
    extractedTopic: string;
  }[];
}

export interface BusinessInsight {
  id: string;
  title: string;
  category: 'Pricing' | 'Operations' | 'Marketing' | 'Investment' | 'Quality';
  impactLevel: 'High' | 'Medium' | 'Low';
  expectedAnnualImpactUSD: number;
  recommendationText: string;
  targetCities: CityName[];
  actionStatus: 'Recommended' | 'In Progress' | 'Implemented';
  mlConfidence: number; // e.g. 0.94
}

export interface DataQualityAudit {
  timestamp: string;
  totalRecordsChecked: number;
  missingValuesCount: number;
  missingValuesAction: string;
  duplicatesCount: number;
  duplicatesAction: string;
  outliersCount: number;
  outliersAction: string;
  invalidDataCount: number;
  invalidDataAction: string;
  overallHealthScore: number; // 0-100
  cleaningReportSummary: string[];
}

export interface CodeReferenceItem {
  id: string;
  title: string;
  category: 'SQL ETL' | 'Power BI DAX' | 'Python ML (Prophet/XGBoost)' | 'NLP Preprocessing';
  description: string;
  language: 'sql' | 'dax' | 'python';
  code: string;
}
