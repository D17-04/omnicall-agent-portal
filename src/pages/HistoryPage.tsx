import React, { useState, useMemo } from 'react';
import { useCallCenter } from '../context/CallCenterContext';
import { CallFilters } from '../components/history/CallFilters';
import { CallHistoryTable } from '../components/history/CallHistoryTable';

export const HistoryPage: React.FC = () => {
  const { callHistory, viewCustomerById } = useCallCenter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredCalls = useMemo(() => {
    return callHistory.filter((call) => {
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = call.customerName.toLowerCase().includes(query);
        const matchPhone = call.customerPhone.toLowerCase().includes(query);
        const matchNotes = (call.notes || '').toLowerCase().includes(query);
        const matchQueue = call.queue.toLowerCase().includes(query);
        const matchDisp = (call.disposition || '').toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchNotes && !matchQueue && !matchDisp) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && call.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && call.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [callHistory, searchTerm, statusFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Call History & Interaction Logs</h2>
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {callHistory.length} Total Records
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Complete audit trail of all answered, resolved, transferred, and missed customer calls.
        </p>
      </div>

      {/* Filter Toolbar */}
      <CallFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onResetFilters={handleResetFilters}
        totalFiltered={filteredCalls.length}
        totalCalls={callHistory.length}
      />

      {/* Interactive Table */}
      <CallHistoryTable
        calls={filteredCalls}
        onSelectCustomer={viewCustomerById}
        onClearFilters={handleResetFilters}
      />
    </div>
  );
};
