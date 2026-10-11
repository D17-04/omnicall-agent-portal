import React, { useEffect, useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Clock, 
  HeartHandshake
} from 'lucide-react';
import { Customer } from '../../types';
import { Badge } from '../common/Badge';
import { TicketList } from './TicketList';
import { formatDate } from '../../utils/formatters';

interface CustomerDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'interactions' | 'tickets' | 'profile'>('interactions');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const getSentimentVariant = (sentiment: Customer['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'emerald';
      case 'frustrated':
      case 'urgent':
        return 'rose';
      case 'neutral':
      default:
        return 'blue';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="customer-drawer-title">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 id="customer-drawer-title" className="text-base font-bold text-slate-900 leading-tight">
                  {customer.name}
                </h3>
                {customer.company && (
                  <p className="text-xs text-slate-600 flex items-center gap-1 font-medium mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {customer.company}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="teal" size="sm">
                    {customer.plan}
                  </Badge>
                  <Badge variant={getSentimentVariant(customer.sentiment)} size="sm" dot>
                    Sentiment: {customer.sentiment}
                  </Badge>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close customer detail drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Contact & LTV Ribbon */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-100/70 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate" title={customer.email}>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{customer.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-emerald-700">{customer.lifetimeValue} LTV</span>
            </div>
          </div>

          {/* Drawer Tabs */}
          <div className="flex border-b border-slate-200 px-4 bg-white" role="tablist">
            <button
              onClick={() => setActiveTab('interactions')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'interactions'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Past Interactions ({customer.interactions.length})
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'tickets'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Tickets ({customer.tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'profile'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Account Notes
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'interactions' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Interaction Timeline
                </h4>
                {customer.interactions.length === 0 ? (
                  <p className="text-xs text-slate-500">No prior interactions logged.</p>
                ) : (
                  <div className="relative border-l-2 border-slate-200 ml-3 space-y-5 py-1">
                    {customer.interactions.map((interaction) => (
                      <div key={interaction.id} className="relative pl-6">
                        {/* Bullet point */}
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-teal-600 border-2 border-white ring-1 ring-teal-200" />
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold text-teal-800 uppercase tracking-wide">
                              {interaction.type} with {interaction.agentName}
                            </span>
                            <span>{formatDate(interaction.date)}</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">{interaction.summary}</p>
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                            <span>Outcome: <strong className="text-slate-700">{interaction.outcome}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Customer Support Tickets
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {customer.tickets.filter((t) => t.status === 'open').length} Open
                  </span>
                </div>
                <TicketList tickets={customer.tickets} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    Agent Advisory Notes
                  </h5>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {customer.notes}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Account Metadata
                  </h5>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Customer ID</span>
                      <span className="font-mono font-medium text-slate-900">{customer.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Customer Since</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {customer.memberSince}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Subscription Tier</span>
                      <span className="font-semibold text-teal-700">{customer.plan}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Total Value</span>
                      <span className="font-bold text-slate-900">{customer.lifetimeValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer action */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Close Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

