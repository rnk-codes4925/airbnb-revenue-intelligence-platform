/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, ActiveTab } from './components/layout/Navigation';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { RevenueForecasting } from './components/forecasting/RevenueForecasting';
import { DynamicPricingEngine } from './components/pricing/DynamicPricingEngine';
import { InvestmentDashboard } from './components/investment/InvestmentDashboard';
import { HostPerformanceScore } from './components/hosts/HostPerformanceScore';
import { CustomerReviewAnalytics } from './components/reviews/CustomerReviewAnalytics';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BusinessInsightsGenerator } from './components/insights/BusinessInsightsGenerator';
import { DataQualityModule } from './components/dataquality/DataQualityModule';
import { ReadmeModal } from './components/readme/ReadmeModal';
import { CityName, TimeRange } from './types';
import { GLOBAL_CITIES_DATA, BUSINESS_INSIGHTS_DATA } from './data/mockAirbnbData';
import { exportToCSV, exportChartToJSON } from './utils/exportUtils';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityName>('All Cities');
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [activeTab, setActiveTab] = useState<ActiveTab>('executive');
  const [lastUpdated, setLastUpdated] = useState<string>(
    '2026-08-01 06:45:00 UTC'
  );

  const handleRefreshData = () => {
    const now = new Date();
    setLastUpdated(
      now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
    );
  };

  const handleExportGlobalCSV = () => {
    exportToCSV(GLOBAL_CITIES_DATA, 'airbnb_global_enterprise_dataset');
  };

  const handleExportChartJSON = () => {
    exportChartToJSON(GLOBAL_CITIES_DATA, 'airbnb_global_chart_data');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Corporate Executive Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        timeRange={timeRange}
        onSelectTimeRange={setTimeRange}
        onOpenReadme={() => setActiveTab('readme')}
        onExportGlobalCSV={handleExportGlobalCSV}
        onExportChartJSON={handleExportChartJSON}
        lastUpdated={lastUpdated}
        onRefreshData={handleRefreshData}
      />

      {/* Corporate Executive Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        insightCount={BUSINESS_INSIGHTS_DATA.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'executive' && (
          <ExecutiveDashboard
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />
        )}
        {activeTab === 'forecasting' && <RevenueForecasting />}
        {activeTab === 'pricing' && <DynamicPricingEngine />}
        {activeTab === 'investment' && <InvestmentDashboard />}
        {activeTab === 'hosts' && <HostPerformanceScore />}
        {activeTab === 'nlp' && <CustomerReviewAnalytics />}
        {activeTab === 'map' && (
          <InteractiveMap
            onSelectCity={(city) => {
              setSelectedCity(city);
              setActiveTab('executive');
            }}
          />
        )}
        {activeTab === 'insights' && <BusinessInsightsGenerator />}
        {activeTab === 'data-quality' && <DataQualityModule />}
        {activeTab === 'readme' && (
          <ReadmeModal onClose={() => setActiveTab('executive')} />
        )}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-bold text-slate-800">
              Airbnb Revenue &amp; Business Intelligence Platform
            </span>
            <span>| Enterprise Data Warehouse &amp; ML Operations Suite</span>
          </div>
          <div className="flex items-center space-x-4 font-semibold text-slate-600">
            <span>SQL Star-Schema</span>
            <span>•</span>
            <span>Power BI DAX</span>
            <span>•</span>
            <span>Prophet &amp; XGBoost</span>
            <span>•</span>
            <span>VADER NLP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
