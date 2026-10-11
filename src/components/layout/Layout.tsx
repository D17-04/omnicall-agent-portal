import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation, NavTab } from './Navigation';
import { ActiveCallBanner } from '../active-call/ActiveCallBanner';
import { CustomerDrawer } from '../customer/CustomerDrawer';
import { useCallCenter } from '../../context/CallCenterContext';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const { selectedCustomer, setSelectedCustomer, activeCall } = useCallCenter();

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Application Header */}
      <Header />

      {/* Main Tab Navigation */}
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />

      {/* Persistent Call Banner if agent navigates away while on a call */}
      {activeCall && activeTab !== 'active-call' && (
        <ActiveCallBanner onReturnToCall={() => onTabChange('active-call')} />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Slide-out Customer Detail Drawer */}
      <CustomerDrawer
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {/* Accessible Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">OmniCall Telephony Network:</span>
            <span>All SIP/WebRTC Gateways Operational</span>
          </div>
          <div className="text-slate-400">
            OmniCall Contact Center Suite • Front-End Evaluation Build
          </div>
        </div>
      </footer>
    </div>
  );
};

