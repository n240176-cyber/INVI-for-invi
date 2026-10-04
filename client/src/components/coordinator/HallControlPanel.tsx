import React from 'react';
import { Cpu, WifiOff, Wifi, MapPin } from 'lucide-react';

interface HallControlPanelProps {
  hallId: string;
  esp32DeviceId: string;
  sensorConnected: boolean;
  onToggleSensor?: () => void;
}

export const HallControlPanel: React.FC<HallControlPanelProps> = ({
  hallId,
  esp32DeviceId,
  sensorConnected,
  onToggleSensor,
}) => {
  return (
    <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Hall Location & Hardware Identity */}
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#6F102B] uppercase tracking-wider bg-[#FAF0F3] px-2 py-0.5 rounded-sm border border-[#F2D6DE]">
              <MapPin className="w-3 h-3 text-[#6F102B]" />
              Monitored Location
            </span>
          </div>
          <h2 className="text-[24px] sm:text-[26px] font-bold text-[#1C1C21] mt-1 tracking-tight">
            {hallId}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-[13px] text-[#5A5A66]">
            <Cpu className="w-4 h-4 text-[#848492]" />
            <span className="font-mono text-[13px] text-[#2B2B30] font-medium">
              {esp32DeviceId}
            </span>
            <span className="text-[#D5D1C9]">·</span>
            <span>BLE Presence Node</span>
          </div>
        </div>

        {/* ESP32 Hardware Status Badge */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-[#E2DFD9] bg-[#FAF9F7]">
            {sensorConnected ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#15803D]">
                    Hardware Connected
                  </span>
                  <span className="text-[12px] text-[#5A5A66]">
                    ESP32 Online & Scanning
                  </span>
                </div>
                <Wifi className="w-4 h-4 text-emerald-600 ml-1" />
              </>
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A]">
                    Hardware Offline
                  </span>
                  <span className="text-[12px] text-[#71717A]">
                    Waiting for sensor connection
                  </span>
                </div>
                <WifiOff className="w-4 h-4 text-[#848492] ml-1" />
              </>
            )}
          </div>

          {onToggleSensor && (
            <button
              onClick={onToggleSensor}
              title="Test hardware connection state"
              className="text-[11px] text-[#5A5A66] hover:text-[#6F102B] px-2 py-1.5 border border-[#E2DFD9] hover:border-[#6F102B]/40 rounded-md bg-white transition-colors whitespace-nowrap"
            >
              {sensorConnected ? 'Disconnect ESP32' : 'Connect ESP32'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
