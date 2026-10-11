import React from 'react';
import { LayoutDashboard, PhoneForwarded, Phone, History } from 'lucide-react';
import { useCallCenter } from '../../context/CallCenterContext';

export type NavTab = 'dashboard' | 'queue' | 'active-call' | 'history';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { queue, activeCall, callHistory } = useCallCenter();

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number; isLive?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Agent Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'queue',
      label: 'Incoming Queue',
      icon: <PhoneForwarded className="w-4 h-4" />,
      badge: queue.length > 0 ? queue.length : undefined,
    },
    {
      id: 'active-call',
      label: 'Active Call',
      icon: <Phone className="w-4 h-4" />,
      isLive: !!activeCall,
      badge: activeCall ? 'LIVE' : undefined,
    },
    {
      id: 'history',
      label: 'Call History',
      icon: <History className="w-4 h-4" />,
      badge: callHistory.length,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 shadow-2xs font-semibold border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-teal-700' : 'text-slate-500'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>

                {tab.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}

                {tab.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      tab.isLive
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : isActive
                        ? 'bg-teal-200 text-teal-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
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

