/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Database,
  Download,
  Copy,
  Check,
  Code,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DATA_QUALITY_AUDIT } from '../../data/mockAirbnbData';
import { CODE_REFERENCE_LIBRARY } from '../../data/codeReferenceData';
import { exportToCSV } from '../../utils/exportUtils';

export const DataQualityModule: React.FC = () => {
  const [selectedCodeId, setSelectedCodeId] = useState<string>(CODE_REFERENCE_LIBRARY[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCode =
    CODE_REFERENCE_LIBRARY.find((c) => c.id === selectedCodeId) || CODE_REFERENCE_LIBRARY[0];

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCleaningReport = () => {
    const reportData = [
      {
        timestamp: DATA_QUALITY_AUDIT.timestamp,
        totalRecordsChecked: DATA_QUALITY_AUDIT.totalRecordsChecked,
        missingValuesCount: DATA_QUALITY_AUDIT.missingValuesCount,
        missingValuesAction: DATA_QUALITY_AUDIT.missingValuesAction,
        duplicatesCount: DATA_QUALITY_AUDIT.duplicatesCount,
        duplicatesAction: DATA_QUALITY_AUDIT.duplicatesAction,
        outliersCount: DATA_QUALITY_AUDIT.outliersCount,
        outliersAction: DATA_QUALITY_AUDIT.outliersAction,
        invalidDataCount: DATA_QUALITY_AUDIT.invalidDataCount,
        invalidDataAction: DATA_QUALITY_AUDIT.invalidDataAction,
        overallHealthScore: DATA_QUALITY_AUDIT.overallHealthScore,
      },
    ];
    exportToCSV(reportData, 'airbnb_data_quality_cleaning_report');
  };

  return (
    <div className="space-y-6">
      {/* Data Quality Suite Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Automated Data Quality Module &amp; ETL Audit Suite
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated audit detecting Missing Values, Duplicates, Outliers, and Invalid Data with KNN imputation and Winsorized capping.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCleaningReport}
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-xs font-semibold shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
              <span>Generate Data Cleaning Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Scorecard Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Missing Values */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Missing Values
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
            {DATA_QUALITY_AUDIT.missingValuesCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            ✓ Imputed (KNN Median)
          </div>
        </div>

        {/* Duplicates */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Duplicates
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
            {DATA_QUALITY_AUDIT.duplicatesCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            ✓ 0 Duplicates Detected
          </div>
        </div>

        {/* Outliers */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Outliers (ADR &gt; $2.5K)
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
            {DATA_QUALITY_AUDIT.outliersCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            ✓ Winsorized (99th Pct)
          </div>
        </div>

        {/* Invalid Data */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Invalid Timestamps
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
            {DATA_QUALITY_AUDIT.invalidDataCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            ✓ Converted to ISO-8601
          </div>
        </div>
      </div>

      {/* Detailed Data Cleaning Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Automated ETL Cleansing Log (103,650 Records Audited)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-3">Data Quality Dimension</th>
                <th className="py-2.5 px-3">Anomaly Count</th>
                <th className="py-2.5 px-3">Impacted Fields</th>
                <th className="py-2.5 px-3">Automated Cleaning Action Taken</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">Missing Values</td>
                <td className="py-3 px-3 font-mono">14 records</td>
                <td className="py-3 px-3 font-mono text-slate-600">review_rating, host_response_time</td>
                <td className="py-3 px-3 text-slate-700">{DATA_QUALITY_AUDIT.missingValuesAction}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Cleansed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">Duplicate Records</td>
                <td className="py-3 px-3 font-mono">0 records</td>
                <td className="py-3 px-3 font-mono text-slate-600">booking_id, listing_id</td>
                <td className="py-3 px-3 text-slate-700">{DATA_QUALITY_AUDIT.duplicatesAction}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">Outliers (Extreme Values)</td>
                <td className="py-3 px-3 font-mono">23 records</td>
                <td className="py-3 px-3 font-mono text-slate-600">nightly_price_usd, cleaning_fee</td>
                <td className="py-3 px-3 text-slate-700">{DATA_QUALITY_AUDIT.outliersAction}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Winsorized
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">Invalid Data Formatting</td>
                <td className="py-3 px-3 font-mono">2 records</td>
                <td className="py-3 px-3 font-mono text-slate-600">check_in_date, check_out_date</td>
                <td className="py-3 px-3 text-slate-700">{DATA_QUALITY_AUDIT.invalidDataAction}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Standardized
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recruiter / Academic Technical Code Inspector (SQL / DAX / Python) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-slate-900" />
              <h3 className="text-base font-bold text-slate-900">
                Technical Architecture Code Inspector (SQL ETL / Power BI DAX / Python ML)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect the exact DAX formulas, SQL data warehouse ETL queries, and Prophet/XGBoost scripts powering this platform.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            {CODE_REFERENCE_LIBRARY.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedCodeId(item.id)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  selectedCodeId === item.id
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.category}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Code Display */}
        <div className="bg-slate-900 text-slate-100 rounded-lg p-5 font-mono text-xs relative overflow-x-auto shadow-inner border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold text-white uppercase">{activeCode.title}</span>
            <button
              onClick={() => handleCopyCode(activeCode.code, activeCode.id)}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              {copiedId === activeCode.id ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-slate-200 leading-relaxed overflow-x-auto">
            {activeCode.code}
          </pre>
        </div>
      </div>
    </div>
  );
};
