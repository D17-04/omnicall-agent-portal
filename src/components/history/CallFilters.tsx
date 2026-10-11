import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

interface CallFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalCalls: number;
}

export const CallFilters: React.FC<CallFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onResetFilters,
  totalFiltered,
  totalCalls,
}) => {
  const isFiltered = searchTerm !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search input */}
        <div className="relative">
          <label htmlFor="history-search" className="sr-only">Search call logs</label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="history-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by caller, phone, notes..."
            className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div>
          <label htmlFor="status-filter" className="sr-only">Filter by Call Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">All Call Statuses</option>
            <option value="completed">Completed Calls</option>
            <option value="missed">Missed / Abandoned</option>
          </select>
        </div>

        {/* Priority filter */}
        <div>
          <label htmlFor="priority-filter" className="sr-only">Filter by Priority</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Action / Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{totalFiltered}</strong> of {totalCalls}
          </span>
        </div>
      </div>
    </div>
  );
};
