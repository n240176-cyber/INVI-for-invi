import React, { useState } from 'react';
import { X, UserCheck, Bluetooth, Calendar, Clock } from 'lucide-react';
import { InvigilatorAssignment } from '../../types/invi';

interface AssignInvigilatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignment: InvigilatorAssignment) => void;
  initialValues?: Partial<InvigilatorAssignment>;
}

export const AssignInvigilatorModal: React.FC<AssignInvigilatorModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  initialValues,
}) => {
  const [invigilatorName, setInvigilatorName] = useState(initialValues?.invigilatorName || '');
  const [bleToken, setBleToken] = useState(initialValues?.bleToken || '');
  const [examName, setExamName] = useState(initialValues?.examName || '');
  const [scheduledStart, setScheduledStart] = useState(initialValues?.scheduledStart || '');
  const [durationMinutes, setDurationMinutes] = useState(initialValues?.durationMinutes || 180);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invigilatorName.trim()) {
      setError('Please provide an invigilator name.');
      return;
    }
    if (!bleToken.trim()) {
      setError('Please provide the BLE hardware token identifier.');
      return;
    }
    if (!examName.trim()) {
      setError('Please provide the exam name.');
      return;
    }

    onAssign({
      invigilatorName: invigilatorName.trim(),
      bleToken: bleToken.trim().toUpperCase(),
      examName: examName.trim(),
      scheduledStart: scheduledStart.trim() || '09:00 AM',
      durationMinutes: Number(durationMinutes) || 180,
      assignedAt: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-lg border border-[#E2DFD9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7E1] bg-[#FAF9F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#FAF0F3] border border-[#F2D6DE] flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-[#6F102B]" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#1C1C21]">
                Assign Invigilator to HALL-G-04
              </h3>
              <p className="text-[12px] text-[#71717A]">
                Link duty credentials and Bluetooth presence tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#848492] hover:text-[#1C1C21] rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
              Invigilator Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={invigilatorName}
                onChange={(e) => setInvigilatorName(e.target.value)}
                placeholder="Enter invigilator name"
                className="w-full h-10 pl-3 pr-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
              BLE Hardware Token *
            </label>
            <div className="relative">
              <input
                type="text"
                value={bleToken}
                onChange={(e) => setBleToken(e.target.value)}
                placeholder="Enter BLE token (e.g. INV-TAG-01)"
                className="w-full h-10 pl-9 pr-3 text-[14px] font-mono uppercase bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
              />
              <Bluetooth className="w-4 h-4 text-[#848492] absolute left-3 top-3 pointer-events-none" />
            </div>
            <span className="text-[11px] text-[#848492] mt-1 block">
              The ESP32 scans for this BLE beacon identifier inside HALL-G-04
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
              Exam Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Enter examination paper or module"
                className="w-full h-10 pl-9 pr-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
              />
              <Calendar className="w-4 h-4 text-[#848492] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
                Scheduled Start
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={scheduledStart}
                  onChange={(e) => setScheduledStart(e.target.value)}
                  placeholder="e.g. 09:30 AM"
                  className="w-full h-10 pl-9 pr-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />
                <Clock className="w-4 h-4 text-[#848492] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">
                Duration (Minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  placeholder="e.g. 180"
                  className="w-full h-10 px-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#EAE7E1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-[#4A4A54] bg-white hover:bg-[#F8F7F5] border border-[#D5D1C9] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[13px] font-medium text-white bg-[#6F102B] hover:bg-[#5A0C22] rounded-md transition-colors shadow-2xs"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
