import React from 'react';
import { useInvi } from '../context/InviContext';
import { InviLogo } from '../components/common/InviLogo';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

import {
  UserCheck,
  Radio,
  Clock,
  Building2,
  Calendar,
  Bluetooth,
  HelpCircle,
} from 'lucide-react';

export const InvigilatorPage: React.FC = () => {
  const { state } = useInvi();

  const isAssigned = !!state.activeAssignment;

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#F8F7F5] py-4 sm:py-8 px-3 sm:px-4">

      <div className="max-w-md mx-auto space-y-4">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 shadow-2xs">

          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1]">

            <div className="flex items-center gap-3">

              <InviLogo size={32} />

              <div>

                <h1 className="text-[18px] font-bold text-[#1C1C21] leading-tight">
                  My Duty
                </h1>

                <p className="text-[11px] text-[#71717A]">
                  Invigilator Presence Portal
                </p>

              </div>

            </div>

            <StatusBadge
              status={state.examStatus}
              size="sm"
            />

          </div>


          <div className="mt-3 flex items-center justify-between text-[12px] text-[#5A5A66]">

            <span className="flex items-center gap-1.5 font-medium text-[#2B2B30]">

              <Building2 className="w-3.5 h-3.5 text-[#6F102B]" />

              {state.hallId}

            </span>


            <span className="text-[#C4C0B8]">
              |
            </span>


            <span className="flex items-center gap-1">

              <Radio className="w-3.5 h-3.5 text-[#848492]" />

              {state.sensorConnected ? (

                <span className="text-emerald-700">
                  ESP32 Online
                </span>

              ) : (

                <span className="text-[#71717A]">
                  Sensor Offline
                </span>

              )}

            </span>

          </div>

        </div>


        {/* =========================================
            DUTY ASSIGNMENT
        ========================================= */}

        <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 shadow-2xs">

          <div className="flex items-center gap-2 pb-3 border-b border-[#EAE7E1] mb-3">

            <UserCheck className="w-4 h-4 text-[#6F102B]" />

            <h2 className="text-[15px] font-semibold text-[#1C1C21]">
              Examination Duty Assignment
            </h2>

          </div>


          {isAssigned ? (

            <div className="space-y-3">

              {/* INVIGILATOR NAME */}

              <div>

                <span className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider block">
                  Invigilator Name
                </span>

                <p className="text-[17px] font-semibold text-[#1C1C21] mt-0.5">
                  {state.activeAssignment?.invigilatorName}
                </p>

              </div>


              {/* EXAM DETAILS */}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F2EFEB] text-[13px]">

                <div>

                  <span className="text-[11px] text-[#71717A] block">
                    Paper / Exam
                  </span>

                  <span className="font-medium text-[#2B2B30] flex items-center gap-1 mt-0.5">

                    <Calendar className="w-3.5 h-3.5 text-[#848492]" />

                    {state.activeAssignment?.examName}

                  </span>

                </div>


                <div>

                  <span className="text-[11px] text-[#71717A] block">
                    Scheduled Start
                  </span>

                  <span className="font-medium text-[#2B2B30] flex items-center gap-1 mt-0.5">

                    <Clock className="w-3.5 h-3.5 text-[#848492]" />

                    {state.activeAssignment?.scheduledStart}

                  </span>

                </div>

              </div>


              {/* BLE TOKEN */}

              <div className="pt-2 border-t border-[#F2EFEB] flex items-center justify-between">

                <span className="text-[12px] text-[#71717A]">
                  Assigned Token:
                </span>

                <span className="font-mono text-[12px] bg-[#FAF9F7] border border-[#E2DFD9] px-2 py-0.5 rounded text-[#2B2B30] flex items-center gap-1 font-semibold">

                  <Bluetooth className="w-3 h-3 text-[#6F102B]" />

                  {state.activeAssignment?.bleToken}

                </span>

              </div>

            </div>

          ) : (

            <EmptyState
              icon={UserCheck}
              title="No active duty assigned"
              description="Your coordinator has not scheduled an invigilation slot for this session yet."
              compact
            />

          )}

        </div>


        {/* =========================================
            PRESENCE CONFIRMATION
        ========================================= */}

        <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 shadow-2xs">

          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] mb-3">

            <div className="flex items-center gap-2">

              <Bluetooth className="w-4 h-4 text-[#6F102B]" />

              <h2 className="text-[15px] font-semibold text-[#1C1C21]">
                Presence Confirmation
              </h2>

            </div>


            <span
              className={`w-2.5 h-2.5 rounded-full ${
                state.presenceConfirmed
                  ? 'bg-emerald-500'
                  : isAssigned
                    ? 'bg-amber-500'
                    : 'bg-neutral-400'
              }`}
            />

          </div>


          <div className="p-3 rounded-md bg-[#FAF9F7] border border-[#E2DFD9] text-[13px]">

            {!isAssigned ? (

              <p className="text-[#71717A] italic text-center py-1">
                Waiting for assignment
              </p>

            ) : !state.sensorConnected ? (

              <p className="text-[#71717A] text-center py-1">
                Hall sensor offline. Presence confirmation will resume once ESP32 reconnects.
              </p>

            ) : state.presenceConfirmed ? (

              <div className="text-center py-1 text-emerald-800 font-medium">

                Presence Verified in {state.hallId}

              </div>

            ) : (

              <div className="text-center py-1 text-[#5A5A66]">

                Scanning for token{' '}

                <span className="font-mono font-semibold">
                  {state.activeAssignment?.bleToken}
                </span>

                {' '}inside hall boundary...

              </div>

            )}

          </div>

        </div>


        {/* =========================================
            EXAM STATUS & COUNTDOWN
        ========================================= */}

        <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 shadow-2xs">

          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] mb-3">

            <div className="flex items-center gap-2">

              <Clock className="w-4 h-4 text-[#6F102B]" />

              <h2 className="text-[15px] font-semibold text-[#1C1C21]">
                Exam Status & Countdown
              </h2>

            </div>

          </div>


          {state.examStatus === 'IDLE' ? (

            <EmptyState
              icon={Clock}
              title="No active examination"
              description="Countdown timer activates automatically when scheduled examination commences."
              compact
            />

          ) : state.remainingSeconds !== null ? (

            <div className="text-center py-2">

              <span className="text-[12px] font-medium text-[#71717A] uppercase tracking-wider">
                Time Remaining
              </span>


              <div className="font-mono text-[36px] font-bold text-[#6F102B] tabular-nums mt-1">

                {Math.floor(
                  state.remainingSeconds / 60
                )}

                :

                {(state.remainingSeconds % 60)
                  .toString()
                  .padStart(2, '0')}

              </div>

            </div>

          ) : (

            <div className="text-center py-3 bg-[#FAF9F7] rounded-md border border-[#E2DFD9] text-[13px] text-[#71717A]">

              Examination status:{' '}

              <span className="font-medium text-[#1C1C21]">
                {state.examStatus}
              </span>

            </div>

          )}

        </div>


        {/* =========================================
            SIMPLE INFORMATION NOTE
        ========================================= */}

        <div className="text-center text-[12px] text-[#848492] pt-2 pb-4 flex items-center justify-center gap-1.5">

          <HelpCircle className="w-3.5 h-3.5 text-[#848492]" />

          <span>
            Keep your BLE token powered during the invigilation window.
          </span>

        </div>

      </div>

    </div>
  );
};