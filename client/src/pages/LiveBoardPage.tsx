import React from 'react';
import { useInvi } from '../context/InviContext';
import { InviLogo } from '../components/common/InviLogo';
import { StatusBadge } from '../components/common/StatusBadge';
import { Building2, Radio, UserRound, Clock, ShieldCheck } from 'lucide-react';
import { ExamStatus } from '../types/invi';

export const LiveBoardPage: React.FC = () => {
  const { state } = useInvi();

  const getPublicStateDisplay = (status: ExamStatus, hasAssignment: boolean) => {
    switch (status) {
      case 'AWAITING_INVIGILATOR':
        return {
          title: 'WAITING FOR INVIGILATOR',
          subtitle: 'Scheduled examination is queued. Awaiting invigilator check-in.',
          themeColor: 'text-[#6F102B]',
          dotColor: 'bg-[#6F102B]',
        };
      case 'READY':
        return {
          title: 'READY FOR COMMENCEMENT',
          subtitle: 'Invigilator verified on site. Waiting for formal exam start.',
          themeColor: 'text-[#15803D]',
          dotColor: 'bg-[#15803D]',
        };
      case 'EXAM_ACTIVE':
        return {
          title: 'EXAMINATION IN PROGRESS',
          subtitle: 'Quiet Please · Hall monitoring is actively engaged.',
          themeColor: 'text-[#6F102B]',
          dotColor: 'bg-[#6F102B] animate-pulse',
        };
      case 'WARNING':
        return {
          title: 'CHECK-IN PENDING',
          subtitle: 'Invigilator arrival window approaching deadline.',
          themeColor: 'text-[#B45309]',
          dotColor: 'bg-[#B45309]',
        };
      case 'LATE':
        return {
          title: 'INVIGILATOR DELAYED',
          subtitle: 'Examination administration is coordinating replacement.',
          themeColor: 'text-[#B91C1C]',
          dotColor: 'bg-[#B91C1C]',
        };
      case 'PRESENCE_CHECK':
        return {
          title: 'PRESENCE CHECK IN PROGRESS',
          subtitle: 'Sensor verifying hall presence.',
          themeColor: 'text-[#D97706]',
          dotColor: 'bg-[#D97706]',
        };
      case 'COMPLETED':
        return {
          title: 'EXAMINATION CONCLUDED',
          subtitle: 'Session concluded. Scripts collection in progress.',
          themeColor: 'text-[#166534]',
          dotColor: 'bg-[#15803D]',
        };
      case 'IDLE':
      default:
        return {
          title: hasAssignment ? 'WAITING FOR INVIGILATOR' : 'WAITING FOR EXAMINATION',
          subtitle: 'No active testing session currently in progress.',
          themeColor: 'text-[#48484A]',
          dotColor: 'bg-[#8E8E93]',
        };
    }
  };

  const publicDisplay = getPublicStateDisplay(state.examStatus, !!state.activeAssignment);

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#F8F7F5] flex flex-col justify-between p-4 sm:p-8 lg:p-12 invi-bg-pattern">
      <div className="max-w-4xl w-full mx-auto my-auto space-y-6">
        {/* Clean Institutional Live Top Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E2DFD9]">
          <div className="flex items-center gap-3">
            <InviLogo size={36} />
            <div>
              <h1 className="text-[20px] font-bold text-[#1C1C21] tracking-tight">
                Live Examination Status
              </h1>
              <p className="text-[12px] text-[#71717A]">
                Official Hall Readiness Public Terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-semibold text-[#1C1C21] px-2.5 py-1 bg-white border border-[#E2DFD9] rounded-md">
              {state.hallId}
            </span>
          </div>
        </div>

        {/* Hero Operational Hall State Card */}
        <div className="bg-white border border-[#E2DFD9] rounded-xl p-6 sm:p-10 shadow-xs text-center space-y-8">
          {/* Hall Title & Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF0F3] border border-[#F2D6DE] rounded-full text-[12px] font-semibold text-[#6F102B] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#6F102B]" />
              Hall Readiness Monitor
            </div>
            <h2 className="text-[32px] sm:text-[44px] font-extrabold text-[#1C1C21] tracking-tight pt-2">
              {state.hallId}
            </h2>
            {state.activeAssignment?.examName && (
              <p className="text-[16px] sm:text-[18px] font-medium text-[#5A5A66]">
                {state.activeAssignment.examName}
              </p>
            )}
          </div>

          {/* Primary High-Legibility Hall State Banner */}
          <div className="py-6 px-4 bg-[#FAF9F7] rounded-lg border border-[#E2DFD9] max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <span className={`w-3 h-3 rounded-full ${publicDisplay.dotColor}`} />
              <StatusBadge status={state.examStatus} size="lg" />
            </div>

            <div
              className={`text-[26px] sm:text-[36px] font-bold tracking-tight uppercase mt-2 ${publicDisplay.themeColor}`}
            >
              {publicDisplay.title}
            </div>
            <p className="text-[14px] text-[#5A5A66] mt-2 max-w-lg mx-auto leading-relaxed">
              {publicDisplay.subtitle}
            </p>

            {/* Optional Countdown Display (Only shown when time data exists) */}
            {state.remainingSeconds !== null && (
              <div className="mt-6 pt-4 border-t border-[#EAE7E1]">
                <span className="text-[12px] font-medium text-[#71717A] uppercase tracking-wider">
                  Session Countdown
                </span>
                <div className="font-mono text-[42px] sm:text-[54px] font-bold text-[#6F102B] tabular-nums leading-none mt-1">
                  {Math.floor(state.remainingSeconds / 60)}:
                  {(state.remainingSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}
          </div>

          {/* Key Parameters Row (Sensor, Invigilator, Scheduled Start) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-2xl mx-auto text-left">
            {/* Sensor Status */}
            <div className="p-3.5 bg-white border border-[#E2DFD9] rounded-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-[#848492]" />
                Hall Sensor
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    state.sensorConnected ? 'bg-emerald-500' : 'bg-neutral-400'
                  }`}
                />
                <span className="text-[14px] font-semibold text-[#1C1C21]">
                  {state.sensorConnected ? 'Sensor Connected' : 'Waiting for sensor'}
                </span>
              </div>
            </div>

            {/* Invigilator Assignment */}
            <div className="p-3.5 bg-white border border-[#E2DFD9] rounded-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                <UserRound className="w-3.5 h-3.5 text-[#848492]" />
                Invigilator
              </div>
              <div className="mt-1 text-[14px] font-semibold text-[#1C1C21] truncate">
                {state.activeAssignment?.invigilatorName || 'Not assigned'}
              </div>
            </div>

            {/* Scheduled Window */}
            <div className="p-3.5 bg-white border border-[#E2DFD9] rounded-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#848492]" />
                Scheduled Start
              </div>
              <div className="mt-1 text-[14px] font-semibold text-[#1C1C21] truncate">
                {state.activeAssignment?.scheduledStart || 'Awaiting schedule'}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Legend for Students */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[12px] text-[#71717A] py-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8E8E93]" />
            Idle / Unscheduled
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6F102B]" />
            Awaiting Check-in
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            Ready / Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
            Invigilator Delayed
          </span>
        </div>
      </div>

      {/* Institutional Read-Only Footer */}
      <footer className="text-center text-[12px] text-[#848492] pt-6 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#6F102B]" />
        <span>INVI Public Examination Board · Read-only Student View</span>
      </footer>
    </div>
  );
};
