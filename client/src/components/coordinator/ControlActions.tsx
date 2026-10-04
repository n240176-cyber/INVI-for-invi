import React, { useState } from 'react';
import { Bell, BellOff, RotateCcw, AlertTriangle } from 'lucide-react';

interface ControlActionsProps {
  alertsEnabled: boolean;
  onToggleAlerts: () => void;
  onResetDemo: () => void;
}

export const ControlActions: React.FC<ControlActionsProps> = ({
  alertsEnabled,
  onToggleAlerts,
  onResetDemo,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    onResetDemo();
    setShowConfirmReset(false);
  };

  return (
    <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
      <div>
        <h4 className="text-[14px] font-semibold text-[#1C1C21]">
          Operational Controls
        </h4>
        <p className="text-[12px] text-[#71717A]">
          Manage alert notifications and session lifecycle
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Enable / Mute Alerts */}
        <button
          onClick={onToggleAlerts}
          className={`px-3.5 py-2 text-[13px] font-medium rounded-md border transition-colors flex items-center gap-2 cursor-pointer ${
            alertsEnabled
              ? 'bg-[#FAF0F3] text-[#6F102B] border-[#F2D6DE] hover:bg-[#F5E6EB]'
              : 'bg-white text-[#4A4A54] border-[#D5D1C9] hover:bg-[#FAF9F7]'
          }`}
        >
          {alertsEnabled ? (
            <>
              <Bell className="w-4 h-4 text-[#6F102B]" />
              Alerts Enabled
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4 text-[#848492]" />
              Enable Alerts
            </>
          )}
        </button>

        {/* End / Reset Demo */}
        {showConfirmReset ? (
          <div className="flex items-center gap-2 p-1 bg-red-50 border border-red-200 rounded-md">
            <span className="text-[12px] text-red-700 px-2 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Reset all data?
            </span>
            <button
              onClick={handleConfirmReset}
              className="px-2.5 py-1 text-[12px] font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-2 py-1 text-[12px] text-[#4A4A54] hover:bg-neutral-200/50 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-3.5 py-2 text-[13px] font-medium text-red-700 bg-white border border-red-300 hover:bg-red-50/70 hover:border-red-400 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-600" />
            End / Reset Demo
          </button>
        )}
      </div>
    </div>
  );
};
