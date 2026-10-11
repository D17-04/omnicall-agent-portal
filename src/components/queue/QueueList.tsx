import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Filter, 
  ArrowUpDown, 
  Inbox
} from 'lucide-react';
import { useCallCenter } from '../../context/CallCenterContext';
import { QueueItem } from './QueueItem';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

interface QueueListProps {
  onGoToActiveCall: () => void;
}

export const QueueList: React.FC<QueueListProps> = ({ onGoToActiveCall }) => {
  const { queue, acceptCall, simulateIncomingCall, viewCustomerById } = useCallCenter();
  const [filterQueue, setFilterQueue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'waitTime' | 'priority'>('waitTime');

  const filteredQueue = useMemo(() => {
    let result = [...queue];

    if (filterQueue !== 'all') {
      result = result.filter((item) => item.queue === filterQueue);
    }

    if (sortBy === 'waitTime') {
      result.sort((a, b) => b.waitTimeSeconds - a.waitTimeSeconds);
    } else if (sortBy === 'priority') {
      const priorityWeight = { critical: 4, high: 3, normal: 2, low: 1 };
      result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    }

    return result;
  }, [queue, filterQueue, sortBy]);

  const uniqueQueues = useMemo(() => {
    return Array.from(new Set(queue.map((item) => item.queue)));
  }, [queue]);

  const handleAcceptCall = (callId: string) => {
    acceptCall(callId);
    onGoToActiveCall();
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Incoming ACD Call Queue</h2>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {queue.length} Waiting
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automatic call distribution queue. Calls are prioritized by VIP tier and SLA threshold.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<PlusCircle className="w-4 h-4 text-teal-600" />}
            onClick={simulateIncomingCall}
          >
            Simulate Inbound Call
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Queue:</span>
          <select
            value={filterQueue}
            onChange={(e) => setFilterQueue(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 rounded-md px-2.5 py-1 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">All Queues ({queue.length})</option>
            {uniqueQueues.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'waitTime' | 'priority')}
            className="bg-white border border-slate-300 text-slate-700 rounded-md px-2.5 py-1 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="waitTime">Longest Wait Time First</option>
            <option value="priority">Highest Priority First</option>
          </select>
        </div>
      </div>

      {/* Queue Listing */}
      {filteredQueue.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-8 h-8 text-teal-600" />}
          title="No Callers in Queue"
          description="The queue is currently clear! You can simulate an incoming test call to test the agent workflow."
          actionLabel="Simulate Inbound Call"
          onAction={simulateIncomingCall}
        />
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((call) => (
            <QueueItem
              key={call.id}
              call={call}
              onAccept={handleAcceptCall}
              onViewCustomer={viewCustomerById}
            />
          ))}
        </div>
      )}
    </div>
  );
};
