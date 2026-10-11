import React, { useState } from 'react';
import { AlertCircle, FileText, Tag, Save } from 'lucide-react';
import { CallDisposition } from '../../types';
import { Button } from '../common/Button';

interface DispositionFormProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  disposition: CallDisposition | '';
  onDispositionChange: (disposition: CallDisposition | '') => void;
  onSaveAndClose: () => boolean;
  isCallEnded: boolean;
}

export const DispositionForm: React.FC<DispositionFormProps> = ({
  notes,
  onNotesChange,
  disposition,
  onDispositionChange,
  onSaveAndClose,
  isCallEnded,
}) => {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const dispositions: { value: CallDisposition; label: string; desc: string }[] = [
    { value: 'resolved', label: 'Issue Resolved', desc: 'Customer issue fully resolved during this interaction' },
    { value: 'escalated', label: 'Escalated to Tier 2 / Engineering', desc: 'Transferred or escalated for investigation' },
    { value: 'follow_up_needed', label: 'Follow-Up Needed', desc: 'Agent or customer must take next steps' },
    { value: 'callback_requested', label: 'Callback Scheduled', desc: 'Customer requested a callback at a specified time' },
    { value: 'billing_adjusted', label: 'Billing / Invoice Adjusted', desc: 'Credit applied, refund queued, or plan changed' },
    { value: 'wrong_number', label: 'Wrong Number / Misdial', desc: 'Inbound caller reached incorrect department' },
    { value: 'spam', label: 'Spam / Robocall', desc: 'Automated telemarketing or suspicious caller' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    onSaveAndClose();
  };

  const isInvalidDisposition = hasAttemptedSubmit && !disposition;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Call Notes Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="call-notes" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            Agent Call Notes & Summary
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {notes.length} characters
          </span>
        </div>
        <textarea
          id="call-notes"
          rows={4}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Document customer inquiries, troubleshooting steps, root cause, and agreed resolutions..."
          className="w-full text-xs sm:text-sm text-slate-800 p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Disposition Dropdown */}
      <div>
        <label htmlFor="call-disposition" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <Tag className="w-3.5 h-3.5 text-teal-600" />
          Call Disposition (Outcome) <span className="text-rose-500">*</span>
        </label>
        
        <select
          id="call-disposition"
          value={disposition}
          onChange={(e) => onDispositionChange(e.target.value as CallDisposition)}
          className={`w-full text-xs sm:text-sm p-2.5 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all ${
            isInvalidDisposition
              ? 'border-rose-400 ring-2 ring-rose-200 text-rose-900'
              : 'border-slate-300 focus:ring-teal-500 text-slate-800'
          }`}
          required
        >
          <option value="" disabled>-- Select Call Disposition --</option>
          {dispositions.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label} — {d.desc}
            </option>
          ))}
        </select>

        {isInvalidDisposition && (
          <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Please specify a call disposition before saving and closing.
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          {isCallEnded ? (
            <span className="text-amber-700 font-medium">Ready to wrap up interaction.</span>
          ) : (
            <span>You can log notes during live call or after ending.</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
          className="shadow-sm font-semibold"
        >
          Save and Close Call
        </Button>
      </div>
    </form>
  );
};
