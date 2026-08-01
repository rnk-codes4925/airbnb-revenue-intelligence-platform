/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Briefcase,
  Award,
  MessageSquare,
  Globe,
  Lightbulb,
  ShieldCheck,
  FileCode,
} from 'lucide-react';

export type ActiveTab =
  | 'executive'
  | 'forecasting'
  | 'pricing'
  | 'investment'
  | 'hosts'
  | 'nlp'
  | 'map'
  | 'insights'
  | 'data-quality'
  | 'readme';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  insightCount?: number;
}

const TABS: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'executive', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'forecasting', label: 'Revenue Forecasting (ML)', icon: TrendingUp },
  { id: 'pricing', label: 'Dynamic Pricing Engine', icon: DollarSign },
  { id: 'investment', label: 'Investment Intelligence', icon: Briefcase },
  { id: 'hosts', label: 'Host Performance Score', icon: Award },
  { id: 'nlp', label: 'Review NLP Analytics', icon: MessageSquare },
  { id: 'map', label: 'Global Map', icon: Globe },
  { id: 'insights', label: 'Business Insights', icon: Lightbulb },
  { id: 'data-quality', label: 'Data Quality & ML Ops', icon: ShieldCheck },
  { id: 'readme', label: 'README & Architecture', icon: FileCode },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab, insightCount = 5 }) => {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent
                  className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : 'text-slate-500'}`}
                />
                <span>{tab.label}</span>
                {tab.id === 'insights' && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive
                        ? 'bg-white text-slate-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {insightCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
