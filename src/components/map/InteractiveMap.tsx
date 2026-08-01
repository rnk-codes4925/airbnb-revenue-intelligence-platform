/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  DollarSign,
  Percent,
  Building2,
  TrendingUp,
  Filter,
  Download,
  Layers,
  Award,
} from 'lucide-react';
import { GLOBAL_CITIES_DATA } from '../../data/mockAirbnbData';
import { CityName } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';

export type MapMetricMode = 'revenue' | 'occupancy' | 'density' | 'top-performing';

interface InteractiveMapProps {
  onSelectCity: (city: CityName) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectCity }) => {
  const [metricMode, setMetricMode] = useState<MapMetricMode>('revenue');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const filteredCities = GLOBAL_CITIES_DATA.filter((city) => {
    return regionFilter === 'All' || city.region === regionFilter;
  });

  const sortedCities = [...filteredCities].sort((a, b) => {
    if (metricMode === 'revenue') return b.totalRevenue - a.totalRevenue;
    if (metricMode === 'occupancy') return b.avgOccupancy - a.avgOccupancy;
    if (metricMode === 'density') return b.activeProperties - a.activeProperties;
    return b.roi - a.roi; // top-performing composite
  });

  const handleExportGeo = () => {
    exportToCSV(sortedCities, `airbnb_geospatial_${metricMode}`);
  };

  return (
    <div className="space-y-6">
      {/* Map Header Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Interactive Global Map &amp; Geospatial Density Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Geospatial distribution of Revenue, Occupancy, Property Density, and Yield across 15 world capital markets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Layer Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              {[
                { id: 'revenue', label: 'Revenue ($)', icon: DollarSign },
                { id: 'occupancy', label: 'Occupancy (%)', icon: Percent },
                { id: 'density', label: 'Property Density', icon: Building2 },
                { id: 'top-performing', label: 'Top Performing', icon: Award },
              ].map((layer) => {
                const IconComponent = layer.icon;
                const isActive = metricMode === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setMetricMode(layer.id as MapMetricMode)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    <span>{layer.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Region Filter */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700"
              aria-label="Filter Map by Region"
            >
              <option value="All">All Global Regions</option>
              <option value="Americas">Americas</option>
              <option value="Europe">Europe</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="Middle East">Middle East</option>
            </select>

            <button
              onClick={handleExportGeo}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Export Geo CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Global World Grid View */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive Geospatial Nodes (Latitude / Longitude Coordinates)
            </span>
            <h3 className="text-base font-bold text-white">
              Global Airbnb Capital Hubs ({filteredCities.length} Markets Tracked)
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            Active Layer: {metricMode.toUpperCase()}
          </span>
        </div>

        {/* City Node Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          {sortedCities.map((city, idx) => {
            // Determine highlight style based on metric
            const valueStr =
              metricMode === 'revenue'
                ? `$${(city.totalRevenue / 1000000).toFixed(2)}M`
                : metricMode === 'occupancy'
                ? `${city.avgOccupancy}%`
                : metricMode === 'density'
                ? `${city.activeProperties.toLocaleString()} props`
                : `${city.roi}% ROI`;

            return (
              <div
                key={city.id}
                onClick={() => onSelectCity(city.city)}
                className="bg-slate-800/80 border border-slate-700 hover:border-slate-500 p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase bg-slate-700 text-slate-300">
                    {city.region}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {city.lat.toFixed(1)}°, {city.lng.toFixed(1)}°
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="font-bold text-sm text-white">{city.city}</div>
                </div>

                <div className="text-xl font-extrabold font-mono text-emerald-400 mt-2">
                  {valueStr}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                  <span>ADR: ${city.avgNightlyPrice}</span>
                  <span className="font-semibold text-white">{city.investmentRecommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geospatial Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Geospatial Market Density &amp; Yield Leaderboard
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">City / Market</th>
                <th className="py-2.5 px-3">Coordinates (Lat, Lng)</th>
                <th className="py-2.5 px-3">Total Annual Revenue</th>
                <th className="py-2.5 px-3">Occupancy (%)</th>
                <th className="py-2.5 px-3">Active Density</th>
                <th className="py-2.5 px-3">ADR ($/night)</th>
                <th className="py-2.5 px-3">Competition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCities.map((city, idx) => (
                <tr
                  key={city.id}
                  onClick={() => onSelectCity(city.city)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {city.city} <span className="text-slate-400 font-normal">({city.country})</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ${(city.totalRevenue / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-3 font-semibold">{city.avgOccupancy}%</td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {city.activeProperties.toLocaleString()} listings
                  </td>
                  <td className="py-3 px-3 font-mono">${city.avgNightlyPrice}</td>
                  <td className="py-3 px-3 font-semibold">{city.competitionIndex}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
