/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Filter,
  Download,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { CityName, TimeRange } from '../../types';
import { triggerExecutivePrintPDF } from '../../utils/exportUtils';

interface HeaderProps {
  selectedCity: CityName;
  onSelectCity: (city: CityName) => void;
  timeRange: TimeRange;
  onSelectTimeRange: (range: TimeRange) => void;
  onOpenReadme: () => void;
  onExportGlobalCSV: () => void;
  onExportChartJSON: () => void;
  lastUpdated: string;
  onRefreshData: () => void;
}

const CITIES: CityName[] = [
  'All Cities',
  'Tokyo',
  'London',
  'Paris',
  'New York',
  'Sydney',
  'Barcelona',
  'Berlin',
  'Rome',
  'Amsterdam',
  'Los Angeles',
  'Toronto',
  'Dubai',
  'Lisbon',
  'Miami',
  'Seoul',
];

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  timeRange,
  onSelectTimeRange,
  onOpenReadme,
  onExportGlobalCSV,
  onExportChartJSON,
  lastUpdated,
  onRefreshData,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          {/* Corporate Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 text-white p-2.5 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Airbnb Revenue &amp; Business Intelligence Platform
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Global Enterprise v4.2
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Executive BI, ML Revenue Forecasting (Prophet/XGBoost) &amp; Dynamic Pricing Engine
              </p>
            </div>
          </div>

          {/* Interactive Filters & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Global City Filter */}
            <div className="relative">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
                <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span className="font-semibold text-slate-500 mr-1.5">Market:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value as CityName)}
                  className="bg-transparent border-none font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  aria-label="Select City Market"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Horizon Filter */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs">
              {(['30D', '90D', '6M', '1Y', '2Y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => onSelectTimeRange(range)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    timeRange === range
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label={`Filter by ${range}`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Refresh Data */}
            <button
              onClick={handleRefreshClick}
              className="inline-flex items-center px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              title={`Last refreshed: ${lastUpdated}`}
              aria-label="Refresh Dataset"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">Refresh</span>
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                aria-label="Export Menu"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                <span>Export</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button
                    onClick={() => {
                      triggerExecutivePrintPDF();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Export Executive PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportGlobalCSV();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Export Dataset CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportChartJSON();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center border-t border-slate-100"
                  >
                    <Layers className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Download Chart JSON</span>
                  </button>
                </div>
              )}
            </div>

            {/* README & Architecture Button */}
            <button
              onClick={onOpenReadme}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
              aria-label="Open README and Architecture"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
              <span>README &amp; Docs</span>
            </button>
          </div>
        </div>

        {/* Audit status strip */}
        <div className="flex items-center justify-between py-1.5 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
              Data Quality Audit: 99.8% Healthy (15 Cities Sharded)
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              ML Models: Prophet Additive + XGBoost Tree Regressor (Active)
            </span>
          </div>
          <div className="text-right font-mono text-slate-400">
            {lastUpdated}
          </div>
        </div>
      </div>
    </header>
  );
};
