import React from 'react';
import { 
  Phone, 
  Building2, 
  Mail, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  AlertCircle, 
  PhoneCall
} from 'lucide-react';
import { useCallCenter } from '../context/CallCenterContext';
import { CallTimer } from '../components/active-call/CallTimer';
import { CallControls } from '../components/active-call/CallControls';
import { DispositionForm } from '../components/active-call/DispositionForm';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatWaitTime } from '../utils/formatters';

interface ActiveCallPageProps {
  onGoToQueue: () => void;
  onGoToDashboard: () => void;
}

export const ActiveCallPage: React.FC<ActiveCallPageProps> = ({
  onGoToQueue,
  onGoToDashboard,
}) => {
  const {
    activeCall,
    activeCustomer,
    activeCallDuration,
    isCallEnded,
    isMuted,
    isOnHold,
    toggleMute,
    toggleHold,
    endActiveCall,
    activeCallNotes,
    setActiveCallNotes,
    activeCallDisposition,
    setActiveCallDisposition,
    saveAndCloseActiveCall,
    setSelectedCustomer,
    queue,
    acceptCall,
  } = useCallCenter();

  // If no call is currently active
  if (!activeCall) {
    const nextInQueue = queue.length > 0 ? queue[0] : null;

    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <EmptyState
          icon={<Phone className="w-8 h-8 text-slate-400" />}
          title="No Active Call Session"
          description="Your softphone is currently idle. When you accept an incoming call from the queue, live call controls, audio timer, customer dossier, and notes will appear here."
          actionLabel="View Incoming Queue"
          onAction={onGoToQueue}
        />

        {nextInQueue && (
          <Card className="p-5 border-teal-200 bg-teal-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Next Waiting Caller
              </span>
              <span className="text-xs font-mono font-semibold text-teal-700">
                Wait: {formatWaitTime(nextInQueue.waitTimeSeconds)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{nextInQueue.customerName}</h4>
                <p className="text-xs text-slate-600">{nextInQueue.queue} • {nextInQueue.customerPhone}</p>
              </div>

              <Button
                variant="success"
                size="md"
                icon={<PhoneCall className="w-4 h-4" />}
                onClick={() => acceptCall(nextInQueue.id)}
              >
                Accept Call Now
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const handleSaveAndClose = (): boolean => {
    const success = saveAndCloseActiveCall();
    if (success) {
      onGoToDashboard();
    }
    return success;
  };

  return (
    <div className="space-y-6">
      {/* Timer & Live Audio Section */}
      <CallTimer
        durationSeconds={activeCallDuration}
        isCallEnded={isCallEnded}
        isOnHold={isOnHold}
        isMuted={isMuted}
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Dossier & Call Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Call Controls Bar */}
          <CallControls
            isMuted={isMuted}
            isOnHold={isOnHold}
            isCallEnded={isCallEnded}
            onToggleMute={toggleMute}
            onToggleHold={toggleHold}
            onEndCall={endActiveCall}
          />

          {/* Customer Dossier Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    activeCustomer?.avatar ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={activeCall.customerName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {activeCall.customerName}
                    </h3>
                    {activeCustomer && (
                      <Badge variant="teal" size="sm">
                        {activeCustomer.plan}
                      </Badge>
                    )}
                    {activeCustomer && (
                      <Badge
                        variant={activeCustomer.sentiment === 'positive' ? 'emerald' : activeCustomer.sentiment === 'frustrated' ? 'rose' : 'blue'}
                        size="sm"
                        dot
                      >
                        {activeCustomer.sentiment}
                      </Badge>
                    )}
                  </div>
                  {activeCustomer?.company && (
                    <p className="text-xs text-slate-600 flex items-center gap-1 font-medium mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {activeCustomer.company}
                    </p>
                  )}
                </div>
              </div>

              {activeCustomer && (
                <button
                  onClick={() => setSelectedCustomer(activeCustomer)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                >
                  <span>Full Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Contact & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-medium">{activeCall.customerPhone}</span>
              </div>
              {activeCustomer?.email && (
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{activeCustomer.email}</span>
                </div>
              )}
              {activeCustomer?.location && (
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeCustomer.location}</span>
                </div>
              )}
              {activeCustomer?.lifetimeValue && (
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-800">{activeCustomer.lifetimeValue} Lifetime Value</span>
                </div>
              )}
            </div>

            {/* Customer Internal Notes Preview */}
            {activeCustomer?.notes && (
              <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Important Account Context
                </span>
                <p className="leading-relaxed">{activeCustomer.notes}</p>
              </div>
            )}

            {/* Open Tickets Preview */}
            {activeCustomer && activeCustomer.tickets.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    Recent Support Tickets ({activeCustomer.tickets.length})
                  </span>
                  <button
                    onClick={() => setSelectedCustomer(activeCustomer)}
                    className="text-teal-700 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-1.5">
                  {activeCustomer.tickets.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="font-mono text-[10px] text-slate-500 font-bold">{t.id}</div>
                        <div className="font-semibold text-slate-800 truncate">{t.title}</div>
                      </div>
                      <Badge variant={t.status === 'open' ? 'rose' : 'teal'} size="sm">
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Real-time Notes & Disposition Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Call Logging & Wrap-Up</h3>
              <p className="text-xs text-slate-500">Document call notes and set resolution disposition</p>
            </div>

            <DispositionForm
              notes={activeCallNotes}
              onNotesChange={setActiveCallNotes}
              disposition={activeCallDisposition}
              onDispositionChange={setActiveCallDisposition}
              onSaveAndClose={handleSaveAndClose}
              isCallEnded={isCallEnded}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
