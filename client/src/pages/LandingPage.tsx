import React from 'react';
import { InviLogo } from '../components/common/InviLogo';
import { CurrentView } from '../components/common/AppHeader';
import { LayoutDashboard, UserCheck, Monitor, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: CurrentView) => void;
  sensorConnected: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  sensorConnected,
}) => {
  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col justify-between p-6 sm:p-10 invi-bg-pattern">
      {/* Decorative Subtle Corner Accents inspired by Logo */}
      <div className="max-w-[1080px] w-full mx-auto my-auto py-8 sm:py-12">
        {/* Brand & Introduction Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-[#E2DFD9] rounded-xl shadow-2xs mb-5">
            <InviLogo size={46} />
          </div>

          <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1C1C21] tracking-tight">
            Examination Hall Monitoring
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#5A5A66] mt-2.5 max-w-lg mx-auto leading-relaxed">
            Real-time invigilator presence and examination readiness powered by localized BLE detection.
          </p>

          <div className="flex items-center justify-center gap-3 mt-4 text-[12px] text-[#71717A]">
            <span className="flex items-center gap-1.5 font-medium text-[#2B2B30]">
              <Cpu className="w-3.5 h-3.5 text-[#6F102B]" />
              Hall Node: HALL-G-04
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  sensorConnected ? 'bg-emerald-500' : 'bg-neutral-400'
                }`}
              />
              {sensorConnected ? 'Hardware Connected' : 'Waiting for sensor'}
            </span>
          </div>
        </div>

        {/* The Three Restrained Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Coordinator */}
          <button
            onClick={() => onSelectRole('coordinator')}
            className="group text-left bg-white border border-[#E2DFD9] hover:border-[#6F102B] rounded-lg p-6 transition-all duration-150 hover:shadow-xs flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-[#FAF9F7] border border-[#E2DFD9] group-hover:border-[#6F102B]/30 group-hover:bg-[#FAF0F3] flex items-center justify-center transition-colors">
                <LayoutDashboard className="w-5 h-5 text-[#4A4A54] group-hover:text-[#6F102B] transition-colors" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1C1C21] group-hover:text-[#6F102B] transition-colors mt-4">
                Coordinator
              </h3>
              <p className="text-[13px] text-[#5A5A66] mt-1.5 leading-normal">
                Configure and monitor the examination hall.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#F2EFEB] flex items-center justify-between text-[13px] font-medium text-[#71717A] group-hover:text-[#6F102B] transition-colors">
              <span>Access Control Center</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 2. Invigilator */}
          <button
            onClick={() => onSelectRole('invigilator')}
            className="group text-left bg-white border border-[#E2DFD9] hover:border-[#6F102B] rounded-lg p-6 transition-all duration-150 hover:shadow-xs flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-[#FAF9F7] border border-[#E2DFD9] group-hover:border-[#6F102B]/30 group-hover:bg-[#FAF0F3] flex items-center justify-center transition-colors">
                <UserCheck className="w-5 h-5 text-[#4A4A54] group-hover:text-[#6F102B] transition-colors" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1C1C21] group-hover:text-[#6F102B] transition-colors mt-4">
                Invigilator
              </h3>
              <p className="text-[13px] text-[#5A5A66] mt-1.5 leading-normal">
                View duty status and presence confirmation.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#F2EFEB] flex items-center justify-between text-[13px] font-medium text-[#71717A] group-hover:text-[#6F102B] transition-colors">
              <span>View Duty Portal</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 3. Live Board */}
          <button
            onClick={() => onSelectRole('live')}
            className="group text-left bg-white border border-[#E2DFD9] hover:border-[#6F102B] rounded-lg p-6 transition-all duration-150 hover:shadow-xs flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-md bg-[#FAF9F7] border border-[#E2DFD9] group-hover:border-[#6F102B]/30 group-hover:bg-[#FAF0F3] flex items-center justify-center transition-colors">
                <Monitor className="w-5 h-5 text-[#4A4A54] group-hover:text-[#6F102B] transition-colors" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1C1C21] group-hover:text-[#6F102B] transition-colors mt-4">
                Live Board
              </h3>
              <p className="text-[13px] text-[#5A5A66] mt-1.5 leading-normal">
                View examination readiness in real time.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#F2EFEB] flex items-center justify-between text-[13px] font-medium text-[#71717A] group-hover:text-[#6F102B] transition-colors">
              <span>Open Public Display</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Quiet Administrative Footer */}
      <footer className="w-full max-w-[1080px] mx-auto pt-6 border-t border-[#EAE7E1] text-[12px] text-[#848492] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6F102B]" />
          <span>INVI Institutional Examination Protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ESP32 BLE Mesh Standard</span>
          <span>·</span>
          <span>Station HALL-G-04</span>
        </div>
      </footer>
    </div>
  );
};
