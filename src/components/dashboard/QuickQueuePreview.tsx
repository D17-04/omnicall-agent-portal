import React from 'react';
import { PhoneForwarded, Phone, ArrowRight, User } from 'lucide-react';
import { useCallCenter } from '../../context/CallCenterContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatWaitTime, getPriorityConfig } from '../../utils/formatters';

interface QuickQueuePreviewProps {
  onViewAllQueue: () => void;
  onGoToActiveCall: () => void;
}

export const QuickQueuePreview: React.FC<QuickQueuePreviewProps> = ({
  onViewAllQueue,
  onGoToActiveCall,
}) => {
  const { queue, acceptCall, viewCustomerById } = useCallCenter();

  const handleAccept = (callId: string) => {
    acceptCall(callId);
    onGoToActiveCall();
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 text-teal-700 rounded-lg border border-teal-100">
            <PhoneForwarded className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Incoming Queue</h3>
            <p className="text-xs text-slate-500">Callers waiting in ACD distribution</p>
          </div>
        </div>

        <button
          onClick={onViewAllQueue}
          className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View All ({queue.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-8 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500 font-medium">All queues clear. No callers waiting at this moment.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {queue.slice(0, 3).map((item) => {
            const pConfig = getPriorityConfig(item.priority);
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all gap-3"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => viewCustomerById(item.customerId)}
                    className="w-9 h-9 rounded-full bg-slate-200 hover:bg-teal-100 flex items-center justify-center text-slate-600 hover:text-teal-700 transition-colors shrink-0 mt-0.5"
                    title="View Customer Profile"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewCustomerById(item.customerId)}
                        className="text-xs font-bold text-slate-900 hover:text-teal-700 text-left hover:underline"
                      >
                        {item.customerName}
                      </button>
                      <Badge variant={item.priority === 'critical' ? 'rose' : item.priority === 'high' ? 'amber' : 'blue'} size="sm" dot>
                        {pConfig.label}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.customerPhone}</span>
                      <span>•</span>
                      <span>Queue: {item.queue}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-700 font-semibold">Wait: {formatWaitTime(item.waitTimeSeconds)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="success"
                    size="sm"
                    icon={<Phone className="w-3.5 h-3.5" />}
                    onClick={() => handleAccept(item.id)}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

