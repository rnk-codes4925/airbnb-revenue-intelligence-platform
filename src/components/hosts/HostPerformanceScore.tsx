/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  Star,
  Clock,
  TrendingUp,
  Percent,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { HOST_SCORECARDS } from '../../data/mockAirbnbData';
import { HostScoreCard } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';

export const HostPerformanceScore: React.FC = () => {
  const [selectedHostId, setSelectedHostId] = useState<string>(
    HOST_SCORECARDS[0].id
  );
  const [classificationFilter, setClassificationFilter] = useState<string>('All');

  const currentHost: HostScoreCard =
    HOST_SCORECARDS.find((h) => h.id === selectedHostId) || HOST_SCORECARDS[0];

  const filteredHosts =
    classificationFilter === 'All'
      ? HOST_SCORECARDS
      : HOST_SCORECARDS.filter((h) => h.classification === classificationFilter);

  const dimensionData = [
    { name: 'Revenue (25%)', score: currentHost.revenueScore, benchmark: 88 },
    { name: 'Occupancy (20%)', score: currentHost.occupancyScore, benchmark: 82 },
    { name: 'Reviews (25%)', score: currentHost.reviewScore, benchmark: 90 },
    { name: 'Response (15%)', score: currentHost.responseTimeScore, benchmark: 85 },
    { name: 'Cancellation (15%)', score: currentHost.cancellationScore, benchmark: 86 },
  ];

  const handleExportHosts = () => {
    exportToCSV(filteredHosts, 'airbnb_host_performance_scores');
  };

  const getClassificationBadgeStyle = (classification: HostScoreCard['classification']) => {
    switch (classification) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Average':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Poor':
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Host Scoring Suite Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Host Performance Score &amp; Quality Classification Engine (0–100)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Weighted index evaluating Host Revenue (25%), Occupancy (20%), Reviews (25%), Response Velocity (15%), and Cancellation Discipline (15%).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Classification Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              {['All', 'Excellent', 'Good', 'Average', 'Poor'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setClassificationFilter(cls)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    classificationFilter === cls
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportHosts}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Host Deep Dive Scorecard */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center shrink-0">
              {currentHost.hostName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900">{currentHost.hostName}</h3>
                {currentHost.superhostStatus && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    ★ SUPERHOST
                  </span>
                )}
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${getClassificationBadgeStyle(
                    currentHost.classification
                  )}`}
                >
                  {currentHost.classification.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Market: <strong className="text-slate-900">{currentHost.city}</strong> | Active Portfolio:{' '}
                <strong className="text-slate-900">{currentHost.listingCount} listings</strong> | Annual Gross Rev:{' '}
                <strong className="text-slate-900 font-mono">${currentHost.annualRevenue.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500 uppercase">Composite Score</div>
              <div className="text-4xl font-extrabold font-mono text-slate-900">
                {currentHost.overallScore}
                <span className="text-base text-slate-400 font-normal"> / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Dimension Scorecard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">Revenue (25%)</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {currentHost.revenueScore}/100
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">Above market median</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">Occupancy (20%)</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {currentHost.occupancyScore}/100
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Consistency index</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">Reviews (25%)</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {currentHost.reviewScore}/100
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Rating: {currentHost.avgRating}★</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">Response Time (15%)</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {currentHost.responseTimeScore}/100
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Avg: {currentHost.avgResponseMinutes}m reply</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase">Cancellation (15%)</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {currentHost.cancellationScore}/100
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Rate: {currentHost.cancellationRatePct}%</div>
          </div>
        </div>

        {/* Chart Comparison: Selected Host vs. City Benchmark */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Dimension Score vs. Global Superhost Benchmark
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimensionData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Host Dimension Score" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Global Superhost Benchmark" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complete Host Scorecard Benchmarking Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Host Performance Leaderboard &amp; Audit Directory
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-2.5 px-3">Host Name</th>
                <th className="py-2.5 px-3">City / Market</th>
                <th className="py-2.5 px-3">Score (0-100)</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Revenue Sc.</th>
                <th className="py-2.5 px-3">Occupancy Sc.</th>
                <th className="py-2.5 px-3">Review Sc.</th>
                <th className="py-2.5 px-3">Response</th>
                <th className="py-2.5 px-3">Cancellation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHosts.map((host) => (
                <tr
                  key={host.id}
                  onClick={() => setSelectedHostId(host.id)}
                  className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedHostId === host.id ? 'bg-slate-100/80 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center space-x-2">
                    <span>{host.hostName}</span>
                    {host.superhostStatus && (
                      <span className="text-amber-500 font-bold" title="Superhost">
                        ★
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{host.city}</td>
                  <td className="py-3 px-3 font-mono font-extrabold text-slate-900">
                    {host.overallScore}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getClassificationBadgeStyle(
                        host.classification
                      )}`}
                    >
                      {host.classification}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{host.revenueScore}</td>
                  <td className="py-3 px-3 font-mono">{host.occupancyScore}</td>
                  <td className="py-3 px-3 font-mono">{host.reviewScore}</td>
                  <td className="py-3 px-3 font-mono">{host.avgResponseMinutes}m</td>
                  <td className="py-3 px-3 font-mono">{host.cancellationRatePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
