/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertCircle,
  Building,
  Sliders,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { PRICING_RECOMMENDATIONS } from '../../data/mockAirbnbData';
import { PropertyPricingRecommendation } from '../../types';

export const DynamicPricingEngine: React.FC = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    PRICING_RECOMMENDATIONS[0].id
  );
  const [simulatedPrice, setSimulatedPrice] = useState<number | null>(null);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Record<string, boolean>>({});

  const currentProperty: PropertyPricingRecommendation =
    PRICING_RECOMMENDATIONS.find((p) => p.id === selectedPropertyId) ||
    PRICING_RECOMMENDATIONS[0];

  // If user hasn't touched the slider for this property, default to suggested price
  const activePrice =
    simulatedPrice !== null ? simulatedPrice : currentProperty.suggestedPrice;

  // Price Elasticity Formula: DeltaOccupancy = elasticity * (DeltaPrice / CurrentPrice) * CurrentOccupancy
  const priceChangeRatio =
    (activePrice - currentProperty.currentPrice) / currentProperty.currentPrice;
  const simulatedOccupancy = Math.max(
    30,
    Math.min(
      98,
      Number(
        (
          currentProperty.currentOccupancyPct *
          (1 + currentProperty.priceElasticity * priceChangeRatio)
        ).toFixed(1)
      )
    )
  );

  // Expected 30-day revenue = ActivePrice * (SimulatedOccupancy / 100) * 30 nights
  const simulated30DayRevenue = Math.round(
    activePrice * (simulatedOccupancy / 100) * 30
  );
  const baseline30DayRevenue = Math.round(
    currentProperty.currentPrice *
      (currentProperty.currentOccupancyPct / 100) *
      30
  );
  const simulatedRevenueIncreasePct = Number(
    (
      ((simulated30DayRevenue - baseline30DayRevenue) /
        baseline30DayRevenue) *
      100
    ).toFixed(1)
  );

  const handlePropertyChange = (id: string) => {
    setSelectedPropertyId(id);
    const prop = PRICING_RECOMMENDATIONS.find((p) => p.id === id);
    if (prop) {
      setSimulatedPrice(prop.suggestedPrice);
    }
  };

  const handleApplyRecommendation = () => {
    setAppliedRecommendations((prev) => ({
      ...prev,
      [currentProperty.id]: true,
    }));
  };

  const isApplied = appliedRecommendations[currentProperty.id] || false;

  return (
    <div className="space-y-6">
      {/* Engine Header & Property Selection Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Dynamic Pricing Recommendation Engine (AI Elasticity Optimization)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated nightly rate optimization using real-time market demand velocity, competitor ADR, and price elasticity curves.
            </p>
          </div>

          {/* Property Selector Dropdown */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs">
            <Building className="w-4 h-4 text-slate-400 mr-2" />
            <span className="font-semibold text-slate-500 mr-2">Property:</span>
            <select
              value={selectedPropertyId}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="bg-transparent border-none font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              aria-label="Select Airbnb Property"
            >
              {PRICING_RECOMMENDATIONS.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.propertyName} ({prop.city} - {prop.propertyType})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Core Recommendation Card (As specified in prompt UI requirements) */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                ML OPTIMIZED RECOMMENDATION
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {currentProperty.neighborhood}, {currentProperty.city}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {currentProperty.propertyName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Competitor Average ADR in Neighborhood: <strong className="text-slate-900">${currentProperty.competitorAvgPrice}/night</strong> | Demand Score:{' '}
              <strong className="text-emerald-700">{currentProperty.demandScore}/100</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isApplied ? (
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                <span>Price (${currentProperty.suggestedPrice}) Applied to Property Listing</span>
              </div>
            ) : (
              <button
                onClick={handleApplyRecommendation}
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-xs font-bold shadow-2xs"
              >
                <span>Apply Recommended Night Price (${currentProperty.suggestedPrice})</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Executive Metrics Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {/* Box 1: Current Price */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Price
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono mt-1">
              ${currentProperty.currentPrice}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Current Occupancy: {currentProperty.currentOccupancyPct}%
            </div>
          </div>

          {/* Box 2: Suggested Night Price */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
              <span>Suggested Price</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 font-mono mt-1">
              ${currentProperty.suggestedPrice}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              +{Math.round(((currentProperty.suggestedPrice - currentProperty.currentPrice) / currentProperty.currentPrice) * 100)}% Nightly Lift
            </div>
          </div>

          {/* Box 3: Expected Occupancy */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Expected Occupancy
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono mt-1">
              {currentProperty.expectedOccupancyPct}%
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              +{Number((currentProperty.expectedOccupancyPct - currentProperty.currentOccupancyPct).toFixed(1))}% point occupancy gain
            </div>
          </div>

          {/* Box 4: Expected Revenue Increase */}
          <div className="bg-slate-900 text-white rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Expected Revenue
            </div>
            <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">
              +{currentProperty.expectedRevenueIncreasePct}%
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Projected 30-day net revenue expansion
            </div>
          </div>
        </div>

        {/* Reason for Recommendation Banner */}
        <div className="mt-6 p-4 rounded-lg bg-slate-100 border border-slate-200 flex items-start space-x-3">
          <div className="bg-slate-900 text-white p-1.5 rounded-md mt-0.5 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Reason for Recommendation
            </div>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-medium">
              &ldquo;{currentProperty.reason}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Price Elasticity Simulator Slider */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-slate-900" />
              <h3 className="text-base font-bold text-slate-900">
                Interactive Price Elasticity &amp; Yield Simulation Workbench
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag the slider to test alternative pricing strategies and simulate projected occupancy response based on elasticity coefficient (ε = {currentProperty.priceElasticity}).
            </p>
          </div>
          <button
            onClick={() => setSimulatedPrice(currentProperty.suggestedPrice)}
            className="text-xs font-semibold text-slate-700 underline hover:text-slate-900 shrink-0"
          >
            Reset Slider to Suggested (${currentProperty.suggestedPrice})
          </button>
        </div>

        {/* Slider Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Minimum Floor ($80/night)</span>
            <span className="text-sm font-bold font-mono bg-slate-900 text-white px-3 py-1 rounded-md">
              Simulated Rate: ${activePrice}/night
            </span>
            <span>Premium Ceiling ($350/night)</span>
          </div>

          <input
            type="range"
            min={80}
            max={350}
            step={5}
            value={activePrice}
            onChange={(e) => setSimulatedPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            aria-label="Nightly Price Simulator Slider"
          />
        </div>

        {/* Real-time Simulator Output Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500">Simulated 30-Day Occupancy</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {simulatedOccupancy}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              vs Baseline ({currentProperty.currentOccupancyPct}%)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500">Projected 30-Day Revenue</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              ${simulated30DayRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Based on {Math.round(30 * (simulatedOccupancy / 100))} nights booked
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            simulatedRevenueIncreasePct >= 0
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="text-xs font-semibold uppercase tracking-wider">
              Simulated Revenue Lift
            </div>
            <div className="text-2xl font-bold font-mono mt-1">
              {simulatedRevenueIncreasePct >= 0 ? '+' : ''}{simulatedRevenueIncreasePct}%
            </div>
            <div className="text-xs mt-1 font-semibold">
              {simulatedRevenueIncreasePct >= currentProperty.expectedRevenueIncreasePct
                ? 'Outperforming baseline recommendation'
                : 'Below optimal yield curve'}
            </div>
          </div>
        </div>
      </div>

      {/* Property Recommendation Matrix Table (All 6 Luxury Properties) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Global Portfolio Dynamic Pricing Schedule (All Tracked Properties)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-2.5 px-3">Property Listing</th>
                <th className="py-2.5 px-3">City / Market</th>
                <th className="py-2.5 px-3">Current Price</th>
                <th className="py-2.5 px-3">Suggested Price</th>
                <th className="py-2.5 px-3">Exp. Occupancy</th>
                <th className="py-2.5 px-3">Exp. Revenue Lift</th>
                <th className="py-2.5 px-3">Demand Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRICING_RECOMMENDATIONS.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedPropertyId(item.id)}
                  className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedPropertyId === item.id ? 'bg-slate-100/70 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900">{item.propertyName}</td>
                  <td className="py-3 px-3 text-slate-600">{item.city}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">${item.currentPrice}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">${item.suggestedPrice}</td>
                  <td className="py-3 px-3 font-semibold">{item.expectedOccupancyPct}%</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800">+{item.expectedRevenueIncreasePct}%</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white">
                      {item.demandScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {appliedRecommendations[item.id] ? (
                      <span className="inline-flex items-center text-emerald-700 font-bold">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Applied
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Pending Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
