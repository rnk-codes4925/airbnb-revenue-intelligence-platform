/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Star,
  Calendar,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  GLOBAL_KPI_SUMMARY,
  GLOBAL_CITIES_DATA,
  MONTHLY_HISTORICAL_TRENDS,
} from '../../data/mockAirbnbData';
import { CityName } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';

interface ExecutiveDashboardProps {
  selectedCity: CityName;
  onSelectCity: (city: CityName) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  selectedCity,
  onSelectCity,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'bookings' | 'cancellations'>(
    'revenue'
  );
  const [sortField, setSortField] = useState<'totalRevenue' | 'avgOccupancy' | 'roi' | 'avgRating'>(
    'totalRevenue'
  );
  const [sortAsc, setSortAsc] = useState(false);

  // Filter cities by selected city or show all
  const filteredCities =
    selectedCity === 'All Cities'
      ? GLOBAL_CITIES_DATA
      : GLOBAL_CITIES_DATA.filter((c) => c.city === selectedCity);

  const sortedCities = [...filteredCities].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  // Calculate dynamic KPIs if a single city is selected
  const singleCity =
    selectedCity !== 'All Cities'
      ? GLOBAL_CITIES_DATA.find((c) => c.city === selectedCity)
      : null;

  const kpis = singleCity
    ? {
        totalRevenue: singleCity.totalRevenue,
        revenueGrowthYoY: singleCity.revenueGrowth,
        avgRevenuePerProperty: Math.round(singleCity.totalRevenue / singleCity.activeProperties),
        avgOccupancyRate: singleCity.avgOccupancy,
        occupancyGrowthYoY: 2.8,
        avgRating: singleCity.avgRating,
        avgNightlyPrice: singleCity.avgNightlyPrice,
        priceGrowthYoY: 5.8,
        totalBookings: singleCity.activeProperties * 42,
        cancellationRate: 7.9,
      }
    : GLOBAL_KPI_SUMMARY;

  const handleExportTable = () => {
    exportToCSV(sortedCities, 'airbnb_global_cities_performance');
  };

  return (
    <div className="space-y-6">
      {/* Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${(kpis.totalRevenue / 1000000).toFixed(2)}M
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-700 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+{kpis.revenueGrowthYoY}% YoY Growth</span>
          </div>
        </div>

        {/* KPI 2: Average Revenue / Property */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Revenue / Prop</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${kpis.avgRevenuePerProperty.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>Annual yield per listing</span>
          </div>
        </div>

        {/* KPI 3: Occupancy Rate */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Occupancy</span>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {kpis.avgOccupancyRate}%
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-700 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+{kpis.occupancyGrowthYoY}% vs Prior Year</span>
          </div>
        </div>

        {/* KPI 4: Average Nightly Price */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Nightly Price</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${kpis.avgNightlyPrice}
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-700 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+{kpis.priceGrowthYoY}% ADR lift</span>
          </div>
        </div>

        {/* KPI 5: Average Rating */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {kpis.avgRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>Based on 42.8K verified reviews</span>
          </div>
        </div>

        {/* KPI 6: Cancellation Rate */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Cancellation Rate</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {kpis.cancellationRate}%
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-700 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            <span>-0.8% YoY (Improved)</span>
          </div>
        </div>
      </div>

      {/* Primary Trend Chart Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Global Performance Trend Analysis (24-Month Historical Series)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive temporal tracking of revenue volume, booking occupancy velocity, and cancellation patterns.
            </p>
          </div>
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveChartTab('revenue')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeChartTab === 'revenue'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue Trend
            </button>
            <button
              onClick={() => setActiveChartTab('bookings')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeChartTab === 'bookings'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Booking &amp; Occupancy Trend
            </button>
            <button
              onClick={() => setActiveChartTab('cancellations')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeChartTab === 'cancellations'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancellation Trend
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'revenue' ? (
              <AreaChart
                data={MONTHLY_HISTORICAL_TRENDS}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue (USD)']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="2023–2024 Actual Revenue ($)"
                  stroke="#0f172a"
                  fill="#f1f5f9"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="revenuePriorYear"
                  name="Prior Year Comparison ($)"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              </AreaChart>
            ) : activeChartTab === 'bookings' ? (
              <LineChart
                data={MONTHLY_HISTORICAL_TRENDS}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px' }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  name="Monthly Bookings Volume"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="occupancy"
                  name="Occupancy Rate (%)"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={MONTHLY_HISTORICAL_TRENDS}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}%`} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Cancellation Rate']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px' }}
                />
                <Legend />
                <Bar
                  dataKey="cancellationRate"
                  name="Cancellation Rate (%)"
                  fill="#475569"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top vs Worst Performing Cities Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Cities Card */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top 5 Performing Cities</h3>
              <p className="text-xs text-slate-500">Ranked by Total Annual Revenue</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              High Yield
            </span>
          </div>

          <div className="space-y-3">
            {GLOBAL_CITIES_DATA.slice(0, 5).map((city, idx) => (
              <div
                key={city.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{city.city}</div>
                    <div className="text-[11px] text-slate-500">{city.country}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">
                    ${(city.totalRevenue / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    +{city.revenueGrowth}% YoY
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worst / Underperforming 4 Cities Card */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Underperforming Markets</h3>
              <p className="text-xs text-slate-500">Ranked by Total Revenue (Opportunities)</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Action Needed
            </span>
          </div>

          <div className="space-y-3">
            {GLOBAL_CITIES_DATA.slice(-4)
              .reverse()
              .map((city, idx) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {15 - idx}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{city.city}</div>
                      <div className="text-[11px] text-slate-500">{city.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-900">
                      ${(city.totalRevenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Occupancy: {city.avgOccupancy}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Executive Quick Commentary & Audit Box */}
        <div className="bg-slate-900 text-white rounded-lg shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Executive Briefing
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Q3 Global Performance Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Global gross bookings expanded by <strong className="text-white">+14.2% YoY</strong>, led by
              unprecedented demand across Asia-Pacific (Tokyo +19.4%, Seoul +18.2%) and European capital hubs.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">✓</span>
                <span>Average Nightly Rate (ADR) rose to $178 without occupancy degradation.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">✓</span>
                <span>Prophet ML model predicts $2.05M peak booking velocity in September.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 font-bold mr-2">!</span>
                <span>Miami &amp; Toronto require targeted pricing adjustments to lift mid-week occupancy.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Prepared by Senior BI Architect</span>
            <span className="font-mono text-slate-300">DAX Star-Schema Verified</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Sortable Global Cities Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              15-City Global Performance Benchmark Table
            </h3>
            <p className="text-xs text-slate-500">
              Sortable enterprise metrics across Revenue, Occupancy, ADR, Competition Index, and Annual ROI.
            </p>
          </div>
          <button
            onClick={handleExportTable}
            className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Export Table CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3">City / Market</th>
                <th className="py-3 px-3">Region</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField('totalRevenue');
                    setSortAsc(!sortAsc);
                  }}
                >
                  Annual Revenue ($) {sortField === 'totalRevenue' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField('avgOccupancy');
                    setSortAsc(!sortAsc);
                  }}
                >
                  Occupancy (%) {sortField === 'avgOccupancy' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th className="py-3 px-3">ADR ($/night)</th>
                <th className="py-3 px-3">Active Listings</th>
                <th className="py-3 px-3">Competition (0-100)</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-900"
                  onClick={() => {
                    setSortField('roi');
                    setSortAsc(!sortAsc);
                  }}
                >
                  Annual ROI {sortField === 'roi' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th className="py-3 px-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedCities.map((city) => (
                <tr
                  key={city.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <div>{city.city}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{city.country}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{city.region}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ${(city.totalRevenue / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-slate-900 h-2 rounded-full"
                          style={{ width: `${city.avgOccupancy}%` }}
                        />
                      </div>
                      <span className="font-semibold">{city.avgOccupancy}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-900">${city.avgNightlyPrice}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{city.activeProperties.toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{city.competitionIndex}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">{city.roi}%</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        city.investmentRecommendation === 'Strong Buy'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : city.investmentRecommendation === 'Buy'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : city.investmentRecommendation === 'Hold'
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {city.investmentRecommendation}
                    </span>
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
