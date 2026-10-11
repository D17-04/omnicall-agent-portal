import React, { useState } from 'react';
import { 
  PhoneCall, 
  ChevronDown, 
  LogOut, 
  PlusCircle, 
  Check, 
  Clock, 
  Coffee, 
  PowerOff,
  Headphones
} from 'lucide-react';
import { useCallCenter } from '../../context/CallCenterContext';
import { AgentStatus } from '../../types';
import { getAgentStatusConfig } from '../../utils/formatters';

export const Header: React.FC = () => {
  const { agent, updateAgentStatus, logout, simulateIncomingCall, queue } = useCallCenter();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const currentStatusConfig = getAgentStatusConfig(agent.status);

  const statusOptions: { status: AgentStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      status: 'available',
      label: 'Available',
      icon: <Check className="w-4 h-4 text-emerald-600" />,
      desc: 'Ready for ACD inbound calls',
    },
    {
      status: 'on_call',
      label: 'On Call',
      icon: <Headphones className="w-4 h-4 text-amber-600" />,
      desc: 'Occupied on active voice call',
    },
    {
      status: 'break',
      label: 'On Break',
      icon: <Coffee className="w-4 h-4 text-blue-600" />,
      desc: '15-min scheduled rest break',
    },
    {
      status: 'offline',
      label: 'Offline',
      icon: <PowerOff className="w-4 h-4 text-slate-500" />,
      desc: 'Logged out of telephony queue',
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm ring-4 ring-teal-50">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">OmniCall</span>
                <span className="bg-teal-100 text-teal-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
                  Agent Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Customer Experience & ACD Console</p>
            </div>
          </div>

          {/* Center Actions: Simulation & Queue alert */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={simulateIncomingCall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="Add a simulated inbound call to test queue and accept flows"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Simulate Inbound Call</span>
            </button>
            {queue.length > 0 && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {queue.length} in queue
              </span>
            )}
          </div>

          {/* Right: Agent Status & Profile */}
          <div className="flex items-center gap-3">
            {/* Status Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs ${currentStatusConfig.bg} hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                aria-expanded={isStatusMenuOpen}
                aria-haspopup="true"
                aria-label={`Current status: ${currentStatusConfig.label}. Click to change.`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${currentStatusConfig.badge}`} />
                <span className="font-semibold text-slate-800">{currentStatusConfig.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
              </button>

              {isStatusMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsStatusMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 focus:outline-none"
                    role="menu"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Agent Status
                    </div>
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.status}
                        onClick={() => {
                          updateAgentStatus(opt.status);
                          setIsStatusMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                          agent.status === opt.status ? 'bg-teal-50/70 font-semibold' : ''
                        }`}
                        role="menuitem"
                      >
                        <span className="mt-0.5">{opt.icon}</span>
                        <div>
                          <div className="text-slate-800 flex items-center gap-1.5">
                            {opt.label}
                            {agent.status === opt.status && (
                              <span className="text-[10px] text-teal-600 bg-teal-100 px-1 rounded font-normal">Active</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Agent Info & Avatar */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
              />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{agent.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Agent #{agent.id}</span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Sign Out"
              aria-label="Sign out of OmniCall"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

