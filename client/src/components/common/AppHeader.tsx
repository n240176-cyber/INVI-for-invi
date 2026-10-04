import React from 'react';
import { InviLogo } from './InviLogo';
import { LayoutDashboard, UserCheck, Monitor, Radio, Compass } from 'lucide-react';

export type CurrentView = 'landing' | 'coordinator' | 'invigilator' | 'live';

interface AppHeaderProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  sensorConnected?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  onNavigate,
  sensorConnected = false,
}) => {
  return (
    <header className="h-[68px] bg-white border-b border-[#E2DFD9] sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left group transition-opacity hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#6F102B] rounded-md p-1 -ml-1"
          aria-label="INVI Home"
        >
          <InviLogo size={34} />
          <div className="flex flex-col leading-tight select-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[19px] font-bold tracking-tight text-[#1C1C21]">
                INVI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F9A77D]" />
            </div>
            <span className="text-[11px] font-medium tracking-wide text-[#71717A]">
              Examination Monitoring System
            </span>
          </div>
        </button>

        {/* Center / Right: Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
              currentView === 'landing'
                ? 'bg-[#FAF0F3] text-[#6F102B] font-semibold border border-[#F2D6DE]'
                : 'text-[#4A4A54] hover:text-[#1C1C21] hover:bg-[#F8F7F5]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => onNavigate('coordinator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
              currentView === 'coordinator'
                ? 'bg-[#FAF0F3] text-[#6F102B] font-semibold border border-[#F2D6DE]'
                : 'text-[#4A4A54] hover:text-[#1C1C21] hover:bg-[#F8F7F5]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Coordinator</span>
          </button>

          <button
            onClick={() => onNavigate('invigilator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
              currentView === 'invigilator'
                ? 'bg-[#FAF0F3] text-[#6F102B] font-semibold border border-[#F2D6DE]'
                : 'text-[#4A4A54] hover:text-[#1C1C21] hover:bg-[#F8F7F5]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Invigilator</span>
          </button>

          <button
            onClick={() => onNavigate('live')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
              currentView === 'live'
                ? 'bg-[#FAF0F3] text-[#6F102B] font-semibold border border-[#F2D6DE]'
                : 'text-[#4A4A54] hover:text-[#1C1C21] hover:bg-[#F8F7F5]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Live Board</span>
          </button>
        </nav>

        {/* Right Indicator (Sensor connection status if coordinator) */}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#E2DFD9]">
          <div className="flex items-center gap-2 text-[12px] text-[#5A5A66]">
            <Radio className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="font-mono text-[12px] text-[#2B2B30]">HALL-G-04</span>
            <span className="text-[#C4C0B8]">|</span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  sensorConnected ? 'bg-emerald-500' : 'bg-neutral-400'
                }`}
              />
              <span className="text-[#71717A]">
                {sensorConnected ? 'Sensor Online' : 'Sensor Offline'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
