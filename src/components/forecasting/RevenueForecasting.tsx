/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Cpu,
  Calendar,
  Layers,
  CheckCircle2,
  Info,
  Download,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { ForecastHorizon, MLModelType } from '../../types';
import { REVENUE_FORECAST_DATA } from '../../data/mockAirbnbData';
import { exportToCSV, exportChartToJSON } from '../../utils/exportUtils';

export const RevenueForecasting: React.FC = () => {
  const [horizon, setHorizon] = useState<ForecastHorizon>('30 Days');
  const [modelType, setModelType] = useState<MLModelType>('Hybrid Ensemble');
  const [showSeasonality, setShowSeasonality] = useState(false);

  const forecastData = REVENUE_FORECAST_DATA[horizon] || REVENUE_FORECAST_DATA['30 Days'];

  const handleExportCSV = () => {
    exportToCSV(forecastData, `revenue_forecast_${horizon.replace(' ', '_')}`);
  };

  const handleExportJSON = () => {
    exportChartToJSON(forecastData, `revenue_forecast_model_${modelType.replace(' ', '_')}`);
  };

  // Calculate summary metrics for the forecast
  const actualCount = forecastData.filter((d) => d.actualRevenue !== null).length;
  const forecastOnly = forecastData.filter((d) => d.isForecast);
  const totalProjectedRevenue = forecastOnly.reduce((sum, item) => sum + item.forecastRevenue, 0);
  const avgForecastRevenue =
    forecastOnly.length > 0 ? Math.round(totalProjectedRevenue / forecastOnly.length) : 0;

  return (
    <div className="space-y-6">
      {/* Forecasting Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Machine Learning Revenue Forecasting Suite (Prophet &amp; XGBoost)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Time-series forecasting with additive weekly/yearly seasonality and gradient-boosted error residual correction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Model Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['Prophet', 'XGBoost', 'Hybrid Ensemble'] as MLModelType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setModelType(m)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center ${
                    modelType === m
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>{m}</span>
                </button>
              ))}
            </div>

            {/* Horizon Switcher: 30 Days | 90 Days | 6 Months | 1 Year */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['30 Days', '90 Days', '6 Months', '1 Year'] as ForecastHorizon[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    horizon === h
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Export Forecast CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Model Accuracy & Hyperparameter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Model Architecture</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {modelType === 'Prophet'
                ? 'Facebook Prophet (v1.1.5)'
                : modelType === 'XGBoost'
                ? 'XGBoost Regressor (n=150)'
                : 'Prophet Trend + XGBoost Residuals'}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Cross-Validation MAPE</div>
            <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
              {modelType === 'Hybrid Ensemble' ? '4.12%' : modelType === 'Prophet' ? '5.48%' : '4.89%'} (High Precision)
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Confidence Interval Band</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              95% Bayesian Posterior Band
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Projected Horizon Sum</div>
            <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
              ${(totalProjectedRevenue / 1000).toLocaleString()}K ({forecastOnly.length} periods)
            </div>
          </div>
        </div>
      </div>

      {/* Primary Forecast Chart with Confidence Band */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {horizon} Revenue Projection &amp; 95% Confidence Interval
            </h3>
            <p className="text-xs text-slate-500">
              Shaded grey band represents upper and lower confidence boundaries generated by {modelType}.
            </p>
          </div>
          <button
            onClick={() => setShowSeasonality(!showSeasonality)}
            className="text-xs font-semibold text-slate-700 underline hover:text-slate-900"
          >
            {showSeasonality ? 'Hide Seasonality Decomposition' : 'Show Seasonality Decomposition'}
          </button>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={forecastData}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `$${Number(value).toLocaleString()}`,
                  name,
                ]}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px' }}
              />
              <Legend />

              {/* Confidence Interval Area (Upper & Lower 95% Bounds) */}
              <Area
                type="monotone"
                dataKey="upperBound95"
                name="Upper 95% Bound ($)"
                stroke="none"
                fill="#cbd5e1"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="lowerBound95"
                name="Lower 95% Bound ($)"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
              />

              {/* Historical Actuals Line */}
              <Line
                type="monotone"
                dataKey="actualRevenue"
                name="Historical Actual Revenue ($)"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                connectNulls={false}
              />

              {/* Projected Forecast Line */}
              <Line
                type="monotone"
                dataKey="forecastRevenue"
                name={`${modelType} Forecast ($)`}
                stroke="#059669"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#059669' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonality & Trend Decomposition Panel */}
      {showSeasonality && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Extracted Underlying Trend Component
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Long-term growth drift isolated from seasonal cycles using piecewise linear regression changepoints.
            </p>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    name="Trend ($)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Seasonal &amp; Holiday Periodic Variation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fourier weekly &amp; yearly seasonality series demonstrating weekend spikes and holiday demand surges.
            </p>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="seasonality" name="Seasonality Adjustment ($)" fill="#475569" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Machine Learning Explainability & Audit Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Forecast Validation Audit &amp; Horizon Breakdown ({horizon})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-3">Date / Timestamp</th>
                <th className="py-2.5 px-3">Data Type</th>
                <th className="py-2.5 px-3">Actual / Projected Revenue</th>
                <th className="py-2.5 px-3">Lower 95% CI</th>
                <th className="py-2.5 px-3">Upper 95% CI</th>
                <th className="py-2.5 px-3">Trend Component</th>
                <th className="py-2.5 px-3">Seasonal Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecastData.map((item) => (
                <tr key={item.date} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{item.date}</td>
                  <td className="py-2.5 px-3">
                    {item.isForecast ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ML FORECAST
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        HISTORICAL ACTUAL
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    ${item.isForecast ? item.forecastRevenue.toLocaleString() : item.actualRevenue?.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">${item.lowerBound95.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">${item.upperBound95.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono text-blue-700">${item.trend.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">${item.seasonality.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
