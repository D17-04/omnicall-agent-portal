import React from 'react';
import { Phone, Clock, User, AlertTriangle, Layers } from 'lucide-react';
import { CallRecord } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatWaitTime, getPriorityConfig } from '../../utils/formatters';

interface QueueItemProps {
  call: CallRecord;
  onAccept: (callId: string) => void;
  onViewCustomer: (customerId: string) => void;
}

export const QueueItem: React.FC<QueueItemProps> = ({
  call,
  onAccept,
  onViewCustomer,
}) => {
  const pConfig = getPriorityConfig(call.priority);

  const isLongWait = call.waitTimeSeconds > 90;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Caller Info */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => onViewCustomer(call.customerId)}
          className="w-11 h-11 rounded-full bg-slate-100 hover:bg-teal-50 flex items-center justify-center text-slate-600 hover:text-teal-700 transition-colors shrink-0 border border-slate-200"
          title="Click to preview customer profile"
        >
          <User className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onViewCustomer(call.customerId)}
              className="text-sm font-bold text-slate-900 hover:text-teal-700 text-left transition-colors"
            >
              {call.customerName}
            </button>
            <Badge
              variant={
                call.priority === 'critical'
                  ? 'rose'
                  : call.priority === 'high'
                  ? 'amber'
                  : 'blue'
              }
              size="sm"
              dot
            >
              {pConfig.label} Priority
            </Badge>
            {isLongWait && (
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> SLA Risk
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="font-mono text-slate-600 font-medium">{call.customerPhone}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {call.queue}
            </span>
          </div>

          {call.notes && (
            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 mt-1 max-w-xl">
              <span className="font-semibold text-slate-700">Inquiry:</span> {call.notes}
            </p>
          )}
        </div>
      </div>

      {/* Wait Time & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="text-left md:text-right">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Wait Time</div>
          <div className={`text-base font-mono font-bold flex items-center md:justify-end gap-1 ${
            isLongWait ? 'text-rose-600' : 'text-slate-800'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {formatWaitTime(call.waitTimeSeconds)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewCustomer(call.customerId)}
          >
            Profile
          </Button>
          <Button
            variant="success"
            size="md"
            icon={<Phone className="w-4 h-4" />}
            onClick={() => onAccept(call.id)}
            className="shadow-sm"
          >
            Accept Call
          </Button>
        </div>
      </div>
    </div>
  );
};

