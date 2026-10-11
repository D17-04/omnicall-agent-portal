import React from 'react';
import { 
  PhoneCall, 
  Clock, 
  PhoneMissed, 
  Smile, 
  CheckCircle, 
  PlusCircle, 
  Activity, 
  Headphones, 
  Coffee, 
  PowerOff,
  ArrowRight
} from 'lucide-react';
import { useCallCenter } from '../context/CallCenterContext';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickQueuePreview } from '../components/dashboard/QuickQueuePreview';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { formatDuration, formatDate, getAgentStatusConfig } from '../utils/formatters';
import { AgentStatus } from '../types';

interface DashboardPageProps {
  onNavigateToQueue: () => void;
  onNavigateToActiveCall: () => void;
  onNavigateToHistory: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToQueue,
  onNavigateToActiveCall,
  onNavigateToHistory,
}) => {
  const { 
    agent, 
    updateAgentStatus, 
    todayStats, 
    callHistory, 
    simulateIncomingCall,
    viewCustomerById
  } = useCallCenter();

  const statusConfig = getAgentStatusConfig(agent.status);

  const statuses: { status: AgentStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'available', label: 'Available', icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> },
    { status: 'on_call', label: 'On Call', icon: <Headphones className="w-4 h-4 text-amber-600" /> },
    { status: 'break', label: 'On Break', icon: <Coffee className="w-4 h-4 text-blue-600" /> },
    { status: 'offline', label: 'Offline', icon: <PowerOff className="w-4 h-4 text-slate-500" /> },
  ];

  const recentCalls = callHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Agent Status Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusConfig.badge}`}
              title={`Status: ${statusConfig.label}`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back, {agent.name}
              </h1>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                {agent.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Shift active since 08:30 AM</span>
              <span>•</span>
              <span className="font-medium text-slate-700">{statusConfig.description}</span>
            </p>
          </div>
        </div>

        {/* Status Toggle Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden lg:inline">
            Status:
          </span>
          {statuses.map((s) => {
            const isActive = agent.status === s.status;
            return (
              <button
                key={s.status}
                onClick={() => updateAgentStatus(s.status)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-pressed={isActive}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calls Handled Today"
          value={todayStats.callsHandled}
          subtitle="Target: 20 calls/shift"
          icon={<PhoneCall className="w-5 h-5" />}
          variant="teal"
          trend={{ value: '+18%', isPositive: true }}
        />

        <StatCard
          title="Avg Handle Time (AHT)"
          value={formatDuration(todayStats.avgHandleTimeSec)}
          subtitle="Target: under 08:00"
          icon={<Clock className="w-5 h-5" />}
          variant="blue"
          trend={{ value: '-24s', isPositive: true }}
        />

        <StatCard
          title="Missed Calls"
          value={todayStats.missedCalls}
          subtitle="Threshold: < 5 calls"
          icon={<PhoneMissed className="w-5 h-5" />}
          variant="rose"
          trend={{ value: '-1', isPositive: true }}
        />

        <StatCard
          title="CSAT Satisfaction"
          value={`${todayStats.csatPercentage}%`}
          subtitle="Target: > 90% positive"
          icon={<Smile className="w-5 h-5" />}
          variant="amber"
          trend={{ value: '+4%', isPositive: true }}
        />
      </div>

      {/* Main Grid: Queue Preview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Queue Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <QuickQueuePreview
            onViewAllQueue={onNavigateToQueue}
            onGoToActiveCall={onNavigateToActiveCall}
          />

          {/* Quick Simulation Trigger */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-100" />
                ACD Live Queue Simulator
              </h3>
              <p className="text-xs text-teal-100 mt-1 max-w-md">
                Simulate an incoming caller to observe real-time wait clock increments, priority scoring, and instant agent pickup.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<PlusCircle className="w-4 h-4 text-emerald-800" />}
              onClick={simulateIncomingCall}
              className="bg-white text-emerald-900 hover:bg-teal-50 border-white shrink-0 font-bold"
            >
              Simulate Inbound Call
            </Button>
          </div>
        </div>

        {/* Right Column: Recent Calls & Quick History (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Completed Calls</h3>
                <p className="text-xs text-slate-500">Your latest logged conversations</p>
              </div>

              <button
                onClick={onNavigateToHistory}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <button
                      onClick={() => viewCustomerById(call.customerId)}
                      className="font-bold text-slate-900 hover:text-teal-700 text-left hover:underline"
                    >
                      {call.customerName}
                    </button>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{formatDate(call.startedAt)}</span>
                      <span>•</span>
                      <span className="font-mono">{formatDuration(call.durationSeconds)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={call.status === 'completed' ? 'teal' : 'rose'} size="sm">
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
