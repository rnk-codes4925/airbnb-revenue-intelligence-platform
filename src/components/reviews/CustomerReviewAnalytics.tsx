/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Filter,
  Download,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { NLP_REVIEW_ANALYTICS } from '../../data/mockAirbnbData';
import { exportToCSV } from '../../utils/exportUtils';

export const CustomerReviewAnalytics: React.FC = () => {
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  const { sentimentSummary, mostCommonComplaints, mostCommonCompliments, keywordFrequency, sampleReviews } =
    NLP_REVIEW_ANALYTICS;

  const filteredReviews =
    sentimentFilter === 'all'
      ? sampleReviews
      : sampleReviews.filter((r) => r.sentiment === sentimentFilter);

  const handleExportNLP = () => {
    exportToCSV(mostCommonComplaints, 'airbnb_nlp_review_complaints');
  };

  return (
    <div className="space-y-6">
      {/* NLP Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Customer Review NLP Sentiment &amp; Root Cause Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Natural Language Processing (VADER &amp; TF-IDF N-Grams) classifying {sentimentSummary.totalReviewsAnalyzed.toLocaleString()} verified reviews into polarity buckets and revenue impact alerts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportNLP}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Export Complaints CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sentiment Summary Breakdown Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Positive Sentiment
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-900 mt-1">
              {sentimentSummary.positivePct}%
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Praise for cleanliness, location &amp; hospitality
            </div>
          </div>
          <Smile className="w-10 h-10 text-emerald-600 opacity-80" />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Neutral Sentiment
            </div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
              {sentimentSummary.neutralPct}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Standard observations on parking &amp; check-out
            </div>
          </div>
          <Meh className="w-10 h-10 text-slate-500 opacity-80" />
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Negative Sentiment
            </div>
            <div className="text-3xl font-extrabold font-mono text-rose-900 mt-1">
              {sentimentSummary.negativePct}%
            </div>
            <div className="text-xs text-rose-700 mt-1">
              Actionable alerts on lockboxes &amp; noise
            </div>
          </div>
          <Frown className="w-10 h-10 text-rose-600 opacity-80" />
        </div>
      </div>

      {/* 2-Column: Most Common Complaints vs. Most Common Compliments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints (Negative NLP Drivers) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <AlertCircle className="w-4 h-4 text-rose-600 mr-2" />
              Most Common Complaints (Root Cause Analysis)
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Revenue Impact Tracked
            </span>
          </div>

          <div className="space-y-3">
            {mostCommonComplaints.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 hover:bg-rose-50/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-slate-100 text-slate-700 mr-2">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.issue}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-700 whitespace-nowrap">
                    -{item.pctOfNegative}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <span>Mentions: {item.mentions.toLocaleString()} reviews</span>
                  <span className="font-semibold text-rose-800">
                    Est. Revenue Leak: -${item.revenueImpactEst.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliments (Positive NLP Drivers) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Most Common Compliments (Key Guest Drivers)
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Retention Boosters
            </span>
          </div>

          <div className="space-y-3">
            {mostCommonCompliments.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 hover:bg-emerald-50/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-slate-100 text-slate-700 mr-2">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.praise}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 whitespace-nowrap">
                    +{item.pctOfPositive}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <span>Mentions: {item.mentions.toLocaleString()} reviews</span>
                  <span className="font-semibold text-emerald-800">
                    High conversion correlate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NLP Keyword Frequency Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">
          Keyword Frequency &amp; Sentiment Spectrum (Top N-Grams)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          TF-IDF word occurrence frequency across positive, neutral, and negative review comment vectors.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordFrequency} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="word" type="category" stroke="#64748b" fontSize={11} width={95} />
              <Tooltip />
              <Bar dataKey="count" name="Mention Count" radius={[0, 4, 4, 0]}>
                {keywordFrequency.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.sentiment === 'positive'
                        ? '#059669'
                        : entry.sentiment === 'negative'
                        ? '#e11d48'
                        : '#475569'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sample Review Explorer */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Customer Review Sentiment Inspector
            </h3>
            <p className="text-xs text-slate-500">Filter real guest feedback and inspect extracted NLP topic categories.</p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            {(['all', 'positive', 'neutral', 'negative'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition-colors ${
                  sentimentFilter === s
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">{rev.propertyName}</span>
                  <span className="text-xs text-slate-400">({rev.city})</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rev.sentiment === 'positive'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.sentiment === 'negative'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rev.sentiment}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-600">
                  {rev.rating} ★ | {rev.date}
                </div>
              </div>

              <p className="text-xs text-slate-700 italic">&ldquo;{rev.comment}&rdquo;</p>
              <div className="mt-2 text-[11px] text-slate-500">
                Extracted NLP Topic: <strong className="text-slate-900">{rev.extractedTopic}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
