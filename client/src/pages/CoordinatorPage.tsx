import React, { useState } from 'react';

import { useInvi } from '../context/InviContext';

import { HallControlPanel } from '../components/coordinator/HallControlPanel';
import { CurrentAssignmentCard } from '../components/coordinator/CurrentAssignmentCard';
import { CurrentExamStatusCard } from '../components/coordinator/CurrentExamStatusCard';
import { ConfigurationPanel } from '../components/coordinator/ConfigurationPanel';
import { AssignInvigilatorModal } from '../components/coordinator/AssignInvigilatorModal';
import { AlertPanel } from '../components/coordinator/AlertPanel';
import { EventTimeline } from '../components/coordinator/EventTimeline';
import { ControlActions } from '../components/coordinator/ControlActions';


export const CoordinatorPage:
React.FC = () => {

  const {
    state,
    assignInvigilator,
    removeAssignment,
    updateSettings,
    toggleAlerts,
    setSensorConnected,
    resetDemo,
  } = useInvi();


  const [
    isAssignModalOpen,
    setIsAssignModalOpen,
  ] = useState(false);


  return (

    <div className="min-h-[calc(100vh-68px)] bg-[#F8F7F5] p-4 sm:p-6 lg:p-8">

      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2DFD9] gap-3">

          <div>

            <h1 className="text-[24px] sm:text-[26px] font-bold text-[#1C1C21] tracking-tight">
              Examination Control Center
            </h1>

            <p className="text-[13px] text-[#5A5A66] mt-0.5">
              Real-time hall monitoring and examination control
            </p>

          </div>


          {/* HARDWARE STATUS */}

          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-md border border-[#E2DFD9] bg-white text-[12px]">

            <span
              className={`w-2 h-2 rounded-full ${
                state.sensorConnected
                  ? 'bg-emerald-500'
                  : 'bg-neutral-400'
              }`}
            />

            <span className="font-mono text-[#2B2B30]">

              {state.esp32DeviceId}:

            </span>

            <span className="text-[#5A5A66]">

              {state.sensorConnected
                ? 'Sensor Connected'
                : 'Sensor Offline'}

            </span>

          </div>

        </div>


        {/* ======================================
            HALL HARDWARE
        ====================================== */}

        <HallControlPanel
          hallId={state.hallId}
          esp32DeviceId={state.esp32DeviceId}
          sensorConnected={state.sensorConnected}
          onToggleSensor={() =>
            setSensorConnected(
              !state.sensorConnected
            )
          }
        />


        {/* ======================================
            MAIN STATUS CARDS
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">


          {/* ASSIGNMENT */}

          <CurrentAssignmentCard
            assignment={
              state.activeAssignment
            }

            onOpenAssignModal={() =>
              setIsAssignModalOpen(
                true
              )
            }

            onRemoveAssignment={
              removeAssignment
            }
          />


          {/* EXAM STATUS
              NO MANUAL SIMULATION
          */}

          <CurrentExamStatusCard
            status={
              state.examStatus
            }

            examName={
              state
                .activeAssignment
                ?.examName
            }

            remainingSeconds={
              state.remainingSeconds
            }
          />


          {/* ALERTS */}

          <AlertPanel
            alerts={
              state.alerts
            }

            alertsEnabled={
              state.alertsEnabled
            }

            onToggleAlerts={
              toggleAlerts
            }
          />

        </div>


        {/* ======================================
            EVENT TIMELINE
        ====================================== */}

        <EventTimeline
          events={
            state.events
          }
        />


        {/* ======================================
            MONITORING SETTINGS
        ====================================== */}

        <ConfigurationPanel
          settings={
            state.settings
          }

          onSave={
            updateSettings
          }
        />


        {/* ======================================
            BOTTOM CONTROLS
        ====================================== */}

        <ControlActions
          alertsEnabled={
            state.alertsEnabled
          }

          onToggleAlerts={
            toggleAlerts
          }

          onResetDemo={
            resetDemo
          }
        />

      </div>


      {/* ======================================
          ASSIGNMENT MODAL
      ====================================== */}

      <AssignInvigilatorModal
        isOpen={
          isAssignModalOpen
        }

        onClose={() =>
          setIsAssignModalOpen(
            false
          )
        }

        onAssign={
          assignInvigilator
        }

        initialValues={
          state.activeAssignment

            ? {
                invigilatorName:
                  state
                    .activeAssignment
                    .invigilatorName,

                bleToken:
                  state
                    .activeAssignment
                    .bleToken,

                examName:
                  state
                    .activeAssignment
                    .examName,

                scheduledStart:
                  state
                    .activeAssignment
                    .scheduledStart,

                durationMinutes:
                  state
                    .activeAssignment
                    .durationMinutes,
              }

            : undefined
        }
      />

    </div>
  );
};