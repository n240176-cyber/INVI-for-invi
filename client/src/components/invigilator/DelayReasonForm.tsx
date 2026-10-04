import React, { useState } from 'react';
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { DelayReasonOption, DelaySubmission } from '../../types/invi';

const REASON_OPTIONS: DelayReasonOption[] = [
  'Traffic',
  'Previous examination duty',
  'Department work',
  'Emergency',
  'Technical issue',
  'Other',
];

interface DelayReasonFormProps {
  existingSubmission: DelaySubmission | null;
  onSubmit: (reason: DelayReasonOption, note: string) => void;
}

export const DelayReasonForm: React.FC<DelayReasonFormProps> = ({
  existingSubmission,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<DelayReasonOption>('Traffic');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedReason, note.trim());
    setSubmitted(true);
  };

  return (
    <div className="bg-white border border-[#E2DFD9] rounded-lg p-5 shadow-2xs">
      <div className="flex items-center gap-2 pb-3 border-b border-[#EAE7E1] mb-4">
        <AlertCircle className="w-4 h-4 text-[#6F102B]" />
        <div>
          <h3 className="text-[15px] font-semibold text-[#1C1C21]">
            Report Delayed Arrival
          </h3>
          <p className="text-[12px] text-[#71717A]">
            Inform the exam coordinator immediately if you are delayed
          </p>
        </div>
      </div>

      {existingSubmission || submitted ? (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-md">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-[14px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Delay Reason Submitted
          </div>
          <div className="mt-2 text-[13px] text-emerald-900 space-y-1">
            <p>
              <span className="font-medium">Category:</span>{' '}
              {existingSubmission?.reason || selectedReason}
            </p>
            {(existingSubmission?.note || note) && (
              <p>
                <span className="font-medium">Note:</span>{' '}
                {existingSubmission?.note || note}
              </p>
            )}
            <p className="text-[11px] text-emerald-700 pt-1">
              Recorded at {existingSubmission?.submittedAt || 'just now'}. Coordinator alerted.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
              Reason for Delay *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value as DelayReasonOption)}
              className="w-full h-11 px-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Estimated arrival in 12 minutes, stuck at university south gate."
              className="w-full p-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 text-[14px] font-semibold text-white bg-[#6F102B] hover:bg-[#5A0C22] rounded-md transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Send className="w-4 h-4" />
            Submit Reason
          </button>
        </form>
      )}
    </div>
  );
};
