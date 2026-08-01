/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  Target,
  Sparkles,
  CheckCircle,
  Download,
  Filter,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { BUSINESS_INSIGHTS_DATA } from '../../data/mockAirbnbData';
import { BusinessInsight } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';

export const BusinessInsightsGenerator: React.FC = () => {
  const [insights, setInsights] = useState<BusinessInsight[]>(BUSINESS_INSIGHTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredInsights =
    selectedCategory === 'All'
      ? insights
      : insights.filter((i) => i.category === selectedCategory);

  const totalEstimatedImpact = filteredInsights.reduce(
    (sum, item) => sum + item.expectedAnnualImpactUSD,
    0
  );

  const handleGenerateFreshInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate analytical refresh
      setIsGenerating(false);
    }, 900);
  };

  const handleToggleStatus = (id: string) => {
    setInsights((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              actionStatus:
                item.actionStatus === 'Recommended'
                  ? 'In Progress'
                  : item.actionStatus === 'In Progress'
                  ? 'Implemented'
                  : 'Recommended',
            }
          : item
      )
    );
  };

  const handleExportInsights = () => {
    exportToCSV(filteredInsights, 'airbnb_executive_business_insights');
  };

  return (
    <div className="space-y-6">
      {/* Insights Engine Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Automated AI/ML Business Insights &amp; Strategic Recommendation Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescriptive analytical actions synthesized from Prophet revenue forecasts, NLP sentiment vectors, and price elasticity simulations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              {['All', 'Pricing', 'Operations', 'Marketing', 'Investment'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateFreshInsights}
              disabled={isGenerating}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-semibold shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`}
              />
              <span>Generate Briefing</span>
            </button>

            <button
              onClick={handleExportInsights}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Financial Opportunity Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Quantified Strategic Opportunity (Annual Yield Lift)
          </span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
            +${(totalEstimatedImpact / 1000000).toFixed(2)}M USD
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Expected cumulative annualized revenue expansion across {filteredInsights.length} actionable executive recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-300">
            <span>ML Confidence Avg: <strong className="text-white">92.2%</strong></span>
          </div>
        </div>
      </div>

      {/* Insight Recommendation Cards (As required by prompt examples) */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 shadow-2xs transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-900 text-white">
                    {insight.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      insight.impactLevel === 'High'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {insight.impactLevel} Financial Impact
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ML Confidence: {(insight.mlConfidence * 100).toFixed(0)}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{insight.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {insight.recommendationText}
                </p>

                <div className="flex items-center space-x-2 mt-3 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Target Hubs:</span>
                  {insight.targetCities.map((city) => (
                    <span
                      key={city}
                      className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Financial Impact Box & Action State */}
              <div className="flex items-center justify-between lg:justify-end space-x-6 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Expected Annual Value</div>
                  <div className="text-xl font-bold font-mono text-emerald-700">
                    +${insight.expectedAnnualImpactUSD.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(insight.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                    insight.actionStatus === 'Implemented'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : insight.actionStatus === 'In Progress'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {insight.actionStatus === 'Implemented'
                    ? '✓ Implemented'
                    : insight.actionStatus === 'In Progress'
                    ? 'In Progress (Click to Complete)'
                    : 'Mark as In Progress'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
