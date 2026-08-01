/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Award,
  Filter,
  Download,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { GLOBAL_CITIES_DATA } from '../../data/mockAirbnbData';
import { exportToCSV } from '../../utils/exportUtils';

export const InvestmentDashboard: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [minRoiFilter, setMinRoiFilter] = useState<number>(0);

  const filteredCities = GLOBAL_CITIES_DATA.filter((city) => {
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    const matchesRoi = city.roi >= minRoiFilter;
    return matchesRegion && matchesRoi;
  });

  const topInvestmentCities = [...GLOBAL_CITIES_DATA]
    .filter((c) => c.investmentRecommendation === 'Strong Buy' || c.investmentRecommendation === 'Buy')
    .sort((a, b) => b.roi - a.roi);

  const handleExportMatrix = () => {
    exportToCSV(filteredCities, 'airbnb_investment_intelligence_matrix');
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Title & Region Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Property Investment Intelligence &amp; Market Opportunity Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis of cap rates, occupancy yield, competition intensity, and downside risk for capital deployment.
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              {['All', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    selectedRegion === region
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportMatrix}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Best Cities for Investment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topInvestmentCities.slice(0, 3).map((city, idx) => (
          <div
            key={city.id}
            className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-xs relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-900 text-white">
                #{idx + 1} BEST INVESTMENT
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {city.investmentRecommendation}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{city.city}</h3>
                <p className="text-xs text-slate-500">{city.country} • {city.region}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-emerald-700">
                  {city.roi}%
                </div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Annual ROI</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <div className="text-[11px] text-slate-400">Occupancy</div>
                <div className="font-bold text-slate-900 font-mono">{city.avgOccupancy}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Avg Revenue</div>
                <div className="font-bold text-slate-900 font-mono">
                  ${Math.round(city.totalRevenue / city.activeProperties).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Competition</div>
                <div className="font-bold text-slate-900 font-mono">{city.competitionIndex}/100</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500">Growth: <strong className="text-emerald-700">+{city.revenueGrowth}% YoY</strong></span>
              <span className="text-slate-500">Risk: <strong className="text-slate-900">{city.riskLevel}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-variable Scatter Plot: Competition Index vs. Annual ROI */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Market Efficiency Matrix: Competition Intensity vs. Annual ROI (%)
            </h3>
            <p className="text-xs text-slate-500">
              Upper-left quadrant represents undervalued high-yield opportunities (Low Competition, High ROI). Bubble size = Total Revenue.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-600 mr-1.5" />
              <span>Strong Buy</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 mr-1.5" />
              <span>Buy</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-slate-400 mr-1.5" />
              <span>Hold / Overvalued</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="competitionIndex"
                name="Competition Index (0-100)"
                unit="/100"
                stroke="#64748b"
                fontSize={12}
                label={{ value: 'Competition Index (Lower is Better)', position: 'bottom', offset: 0, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="roi"
                name="Annual ROI"
                unit="%"
                stroke="#64748b"
                fontSize={12}
                label={{ value: 'Annual ROI (%)', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <ZAxis
                type="number"
                dataKey="totalRevenue"
                range={[80, 500]}
                name="Total Market Revenue"
              />
              <Tooltip
                formatter={(value: any, name: any) => {
                  if (name === 'Annual ROI') return [`${value}%`, name];
                  if (name === 'Total Market Revenue') return [`$${(value / 1000000).toFixed(2)}M`, name];
                  return [value, name];
                }}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px' }}
              />
              <Scatter name="Global Cities" data={filteredCities}>
                {filteredCities.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.investmentRecommendation === 'Strong Buy'
                        ? '#059669'
                        : entry.investmentRecommendation === 'Buy'
                        ? '#2563eb'
                        : '#94a3b8'
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complete 15-City Investment Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Comprehensive Investment Intelligence Matrix (All Tracked Cities)
            </h3>
            <p className="text-xs text-slate-500">
              Complete underwriting metrics for executive capital allocation and risk assessment.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3">City / Market</th>
                <th className="py-3 px-3">ROI (%)</th>
                <th className="py-3 px-3">Occupancy (%)</th>
                <th className="py-3 px-3">Avg Annual Revenue</th>
                <th className="py-3 px-3">Competition (0-100)</th>
                <th className="py-3 px-3">Growth Trend</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Investment Rec.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCities.map((city) => (
                <tr key={city.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    <div>{city.city}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{city.country}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-emerald-700 text-sm">
                    {city.roi}%
                  </td>
                  <td className="py-3 px-3 font-semibold">{city.avgOccupancy}%</td>
                  <td className="py-3 px-3 font-mono text-slate-900">
                    ${Math.round(city.totalRevenue / city.activeProperties).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{city.competitionIndex}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                    +{city.revenueGrowth}%
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        city.riskLevel === 'Low'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : city.riskLevel === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {city.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${
                        city.investmentRecommendation === 'Strong Buy'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : city.investmentRecommendation === 'Buy'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : city.investmentRecommendation === 'Hold'
                          ? 'bg-slate-100 text-slate-800 border-slate-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
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
