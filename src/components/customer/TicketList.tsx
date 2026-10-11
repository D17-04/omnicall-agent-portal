import React from 'react';
import { CustomerTicket } from '../../types';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface TicketListProps {
  tickets: CustomerTicket[];
}

export const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
        No open or past support tickets on file.
      </div>
    );
  }

  const getPriorityVariant = (priority: CustomerTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'rose';
      case 'high':
        return 'amber';
      case 'medium':
        return 'blue';
      case 'low':
        return 'slate';
    }
  };

  const getStatusIcon = (status: CustomerTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs space-y-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {t.id}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant={getPriorityVariant(t.priority)} size="sm">
                {t.priority.toUpperCase()}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium capitalize">
                {getStatusIcon(t.status)}
                {t.status}
              </span>
            </div>
          </div>
          <h4 className="text-xs font-semibold text-slate-800 leading-snug">{t.title}</h4>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Category: {t.category}</span>
            <span>Created {formatDate(t.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

