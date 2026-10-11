import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Star, 
  FileSpreadsheet,
  Clock,
  User
} from 'lucide-react';
import { CallRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  formatDate, 
  formatDuration, 
  getPriorityConfig, 
  getStatusConfig 
} from '../../utils/formatters';

interface CallHistoryTableProps {
  calls: CallRecord[];
  onSelectCustomer: (customerId: string) => void;
  onClearFilters: () => void;
}

type SortField = 'date' | 'customer' | 'duration' | 'priority' | 'csat';

export const CallHistoryTable: React.FC<CallHistoryTableProps> = ({
  calls,
  onSelectCustomer,
  onClearFilters,
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedCalls = [...calls].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      const dateA = new Date(a.startedAt || 0).getTime();
      const dateB = new Date(b.startedAt || 0).getTime();
      comparison = dateA - dateB;
    } else if (sortField === 'customer') {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === 'duration') {
      comparison = a.durationSeconds - b.durationSeconds;
    } else if (sortField === 'priority') {
      const weights = { critical: 4, high: 3, normal: 2, low: 1 };
      comparison = weights[a.priority] - weights[b.priority];
    } else if (sortField === 'csat') {
      comparison = (a.csatRating || 0) - (b.csatRating || 0);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const exportToCSV = () => {
    const headers = ['Call ID,Customer Name,Phone,Queue,Priority,Status,Started At,Duration (s),Disposition,CSAT,Notes'];
    const rows = sortedCalls.map((c) => [
      `"${c.id}"`,
      `"${c.customerName}"`,
      `"${c.customerPhone}"`,
      `"${c.queue}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.startedAt || ''}"`,
      c.durationSeconds,
      `"${c.disposition || ''}"`,
      c.csatRating || '',
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnicall-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-teal-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-teal-600" />
    );
  };

  const formatDispositionLabel = (disp?: string) => {
    if (!disp) return '—';
    return disp.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-teal-600" />
          Call Records & Session Logs
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={exportToCSV}
          disabled={sortedCalls.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {sortedCalls.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-3">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-700">No Call Records Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No calls match your search query or active filter settings. Try adjusting the search keywords.
          </p>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    <span>Date & Time</span>
                    {getSortIcon('date')}
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort('customer')}>
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    {getSortIcon('customer')}
                  </div>
                </th>
                <th className="py-3 px-4">Queue & Priority</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort('duration')}>
                  <div className="flex items-center gap-1">
                    <span>Duration</span>
                    {getSortIcon('duration')}
                  </div>
                </th>
                <th className="py-3 px-4">Status & Outcome</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort('csat')}>
                  <div className="flex items-center gap-1">
                    <span>CSAT</span>
                    {getSortIcon('csat')}
                  </div>
                </th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedCalls.map((call) => {
                const pConfig = getPriorityConfig(call.priority);
                const sConfig = getStatusConfig(call.status);
                return (
                  <tr
                    key={call.id}
                    className="hover:bg-teal-50/40 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {formatDate(call.startedAt)}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectCustomer(call.customerId)}
                          className="font-bold text-slate-900 group-hover:text-teal-700 text-left hover:underline"
                        >
                          {call.customerName}
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{call.customerPhone}</div>
                    </td>

                    {/* Queue & Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{call.queue}</div>
                      <div className="mt-0.5">
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
                          {pConfig.label}
                        </Badge>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold text-slate-700">
                      {call.status === 'missed' ? '—' : formatDuration(call.durationSeconds)}
                    </td>

                    {/* Status & Outcome */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={call.status === 'completed' ? 'teal' : 'rose'}
                          size="sm"
                        >
                          {sConfig.label}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {formatDispositionLabel(call.disposition)}
                      </div>
                    </td>

                    {/* CSAT */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {call.csatRating ? (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{call.csatRating}/5</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Notes preview */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={call.notes}>
                      {call.notes || '—'}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectCustomer(call.customerId)}
                        className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-semibold p-1 hover:bg-teal-100 rounded transition-colors"
                        title="View customer profile"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
