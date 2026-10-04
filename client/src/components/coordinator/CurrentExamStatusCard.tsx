import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { ExamStatus } from '../../types/invi';
import { StatusBadge } from '../common/StatusBadge';

interface CurrentExamStatusCardProps {
  status: ExamStatus;
  examName?: string;
  remainingSeconds: number | null;
  onSetStatus?: (status: ExamStatus) => void;
}

export const CurrentExamStatusCard: React.FC<CurrentExamStatusCardProps> = ({
  status,
  examName,
  remainingSeconds,
  onSetStatus,
}) => {
  return (
    <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#6F102B]" />
            <h3 className="text-[16px] font-semibold text-[#1C1C21]">
              Examination Status
            </h3>
          </div>
          <StatusBadge status={status} size="md" />
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-[12px] font-medium text-[#71717A] uppercase tracking-wider block">
              Active State
            </span>
            <p className="text-[18px] font-semibold text-[#1C1C21] mt-0.5">
              {status === 'IDLE' ? 'No active examination' : examName || status.replace('_', ' ')}
            </p>
          </div>

          {/* Reserved Countdown Area - Shows empty state when no timer data exists */}
          <div className="p-3 rounded-md bg-[#FAF9F7] border border-[#E2DFD9]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#848492]" />
                Exam Countdown
              </span>
              <span className="text-[11px] text-[#848492]">Official Clock</span>
            </div>

            {remainingSeconds !== null ? (
              <div className="font-mono text-[28px] font-bold text-[#6F102B] tabular-nums mt-1">
                {Math.floor(remainingSeconds / 60)}:
                {(remainingSeconds % 60).toString().padStart(2, '0')}
              </div>
            ) : (
              <div className="mt-1 text-[13px] text-[#71717A] italic">
                Timer will activate upon examination start
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coordinator manual status change trigger for testing state rendering */}
      {onSetStatus && (
        <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-[12px]">
          <span className="text-[#71717A]">Simulate Stage:</span>
          <select
            value={status}
            onChange={(e) => onSetStatus(e.target.value as ExamStatus)}
            className="text-[12px] py-1 px-2 border border-[#E2DFD9] rounded bg-white text-[#2B2B30] focus:border-[#6F102B] focus:outline-hidden"
          >
            <option value="IDLE">IDLE</option>
            <option value="AWAITING_INVIGILATOR">AWAITING_INVIGILATOR</option>
            <option value="READY">READY</option>
            <option value="WARNING">WARNING</option>
            <option value="LATE">LATE</option>
            <option value="EXAM_ACTIVE">EXAM_ACTIVE</option>
            <option value="PRESENCE_CHECK">PRESENCE_CHECK</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      )}
    </div>
  );
};
