import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

import {
  SystemState,
  InvigilatorAssignment,
  SystemSettings,
  DelayReasonOption,
  ExamStatus,
  SystemAlert,
  TimelineEvent,
} from '../types/invi';


// =====================================================
// BACKEND
// =====================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? `http://${window.location.hostname}:3000`
    : '');


// =====================================================
// DEFAULT SETTINGS
// =====================================================

const defaultSettings: SystemSettings = {

  examName: '',

  scheduledStartTime: '',

  examDurationMinutes: 0,

  invigilatorName: '',

  bleToken: '',

  firstMissingWarningSec: 60,

  criticalWarningSec: 30,

  bleConfirmationDurationSec: 10,

  presenceLossGracePeriodSec: 10,

  deviceHeartbeatTimeoutSec: 15,

  lateArrivalStartDelaySec: 30,

  alertIntervals: [
    120,
    60,
    30,
    0,
  ],
};


// =====================================================
// INITIAL STATE
// =====================================================

const initialSystemState:
SystemState = {

  hallId:
    'HALL-G-04',

  esp32DeviceId:
    'ESP32-HALL-G04',

  sensorConnected:
    false,

  activeAssignment:
    null,

  examStatus:
    'IDLE',

  alertsEnabled:
    false,

  settings:
    defaultSettings,

  alerts:
    [],

  events:
    [],

  delaySubmission:
    null,

  presenceConfirmed:
    false,

  remainingSeconds:
    null,
};


// =====================================================
// CONTEXT TYPE
// =====================================================

interface InviContextType {

  state:
    SystemState;


  assignInvigilator:
    (
      assignment:
        InvigilatorAssignment
    ) => void;


  removeAssignment:
    () => void;


  updateSettings:
    (
      settings:
        Partial<SystemSettings>
    ) => void;


  toggleAlerts:
    () => void;


  submitDelayReason:
    (
      reason:
        DelayReasonOption,

      note:
        string
    ) => void;


  setExamStatus:
    (
      status:
        ExamStatus
    ) => void;


  setSensorConnected:
    (
      connected:
        boolean
    ) => void;


  resetDemo:
    () => void;
}


const InviContext =
  createContext<
    InviContextType |
    undefined
  >(undefined);


// =====================================================
// VALID BACKEND STATUSES
// =====================================================

const validStatuses:
ExamStatus[] = [

  'IDLE',

  'AWAITING_INVIGILATOR',

  'READY',

  'WARNING_MISSING',

  'LATE',

  'LATE_ARRIVED',

  'EXAM_ACTIVE',

  'PRESENCE_LOST',

  'COMPLETED',
];


// =====================================================
// BACKEND SNAPSHOT
// =====================================================

interface BackendSnapshot {

  status:
    ExamStatus;

  presence:
    boolean;

  deviceOnline:
    boolean;

  remainingSeconds:
    number | null;

  scheduledStartAt:
    string | null;

  assignmentToken:
    string | null;
}


// =====================================================
// ALARM TYPES
// =====================================================

type AlarmType =

  | 'confirmation'

  | 'warning'

  | 'critical'

  | 'lost'

  | 'restored'

  | 'reminder'

  | 'start'

  | 'end'

  | 'device-lost'

  | 'device-restored';


// =====================================================
// PROVIDER
// =====================================================

export const InviProvider:
React.FC<{
  children:
    ReactNode;
}> = ({
  children,
}) => {

  const [
    state,
    setState,
  ] =
    useState<SystemState>(
      initialSystemState
    );


  const alertsEnabledRef =
    useRef<boolean>(
      false
    );


  const audioContextRef =
    useRef<
      AudioContext |
      null
    >(null);


  const previousSnapshotRef =
    useRef<
      BackendSnapshot |
      null
    >(null);


  const firedEventsRef =
    useRef<
      Set<string>
    >(
      new Set()
    );


  const currentAssignmentRef =
    useRef<
      string |
      null
    >(null);


  // ===================================================
  // AUDIO CONTEXT
  // ===================================================

  const getAudioContext =
    () => {

      if (
        audioContextRef
          .current
      ) {

        return audioContextRef
          .current;
      }


      const AudioContextClass =
        window.AudioContext ||
        (window as any)
          .webkitAudioContext;


      if (
        !AudioContextClass
      ) {

        return null;
      }


      const context =
        new AudioContextClass();


      audioContextRef
        .current =
          context;


      return context;
    };


  // ===================================================
  // SINGLE BEEP
  // ===================================================

  const beep =
    async (
      frequency:
        number,

      durationMs:
        number,

      volume =
        0.85
    ) => {

      try {

        const context =
          getAudioContext();


        if (!context) {
          return;
        }


        if (
          context.state ===
          'suspended'
        ) {

          await context
            .resume();
        }


        const oscillator =
          context
            .createOscillator();


        const gain =
          context
            .createGain();


        oscillator.type =
          'sine';


        oscillator
          .frequency
          .value =
            frequency;


        gain.gain
          .setValueAtTime(
            0.001,

            context
              .currentTime
          );


        gain.gain
          .exponentialRampToValueAtTime(

            Math.max(
              0.01,

              Math.min(
                volume,
                1
              )
            ),

            context
              .currentTime +
            0.03
          );


        gain.gain
          .exponentialRampToValueAtTime(

            0.001,

            context
              .currentTime +
            durationMs /
              1000
          );


        oscillator
          .connect(
            gain
          );


        gain.connect(
          context
            .destination
        );


        oscillator
          .start();


        oscillator
          .stop(

            context
              .currentTime +

            durationMs /
              1000
          );

      } catch (error) {

        console.error(
          'Alarm failed:',
          error
        );
      }
    };


  const wait =
    (
      ms:
        number
    ) =>

      new Promise(
        resolve =>

          window.setTimeout(
            resolve,
            ms
          )
      );


  // ===================================================
  // ALARM PATTERNS
  // ===================================================

  const playAlarm =
    async (
      type:
        AlarmType
    ) => {

      if (
        !alertsEnabledRef
          .current
      ) {

        return;
      }


      if (
        type ===
        'confirmation'
      ) {

        await beep(
          700,
          300,
          0.75
        );

        await wait(
          150
        );

        await beep(
          900,
          350,
          0.8
        );

        return;
      }


      if (
        type ===
        'warning'
      ) {

        await beep(
          820,
          550,
          0.85
        );

        await wait(
          250
        );

        await beep(
          820,
          550,
          0.85
        );

        return;
      }


      if (
        type ===
        'critical'
      ) {

        for (
          let i = 0;
          i < 3;
          i++
        ) {

          await beep(
            1050,
            750,
            0.95
          );

          await wait(
            220
          );
        }

        return;
      }


      if (
        type ===
        'lost'
      ) {

        for (
          let i = 0;
          i < 4;
          i++
        ) {

          await beep(
            980,
            700,
            0.95
          );

          await wait(
            180
          );
        }

        return;
      }


      if (
        type ===
        'restored'
      ) {

        await beep(
          620,
          350,
          0.8
        );

        await wait(
          150
        );

        await beep(
          760,
          400,
          0.8
        );

        return;
      }


      if (
        type ===
        'reminder'
      ) {

        await beep(
          800,
          500,
          0.85
        );

        await wait(
          220
        );

        await beep(
          800,
          500,
          0.85
        );

        return;
      }


      if (
        type ===
        'start'
      ) {

        await beep(
          650,
          800,
          0.9
        );

        await wait(
          250
        );

        await beep(
          850,
          900,
          0.9
        );

        return;
      }


      if (
        type ===
        'end'
      ) {

        for (
          let i = 0;
          i < 3;
          i++
        ) {

          await beep(
            600,
            1100,
            1
          );

          await wait(
            300
          );
        }

        return;
      }


      if (
        type ===
        'device-lost'
      ) {

        for (
          let i = 0;
          i < 3;
          i++
        ) {

          await beep(
            1150,
            650,
            0.95
          );

          await wait(
            200
          );
        }

        return;
      }


      if (
        type ===
        'device-restored'
      ) {

        await beep(
          600,
          300,
          0.75
        );

        await wait(
          120
        );

        await beep(
          800,
          300,
          0.75
        );
      }
    };


  // ===================================================
  // BROWSER NOTIFICATION
  // ===================================================

  const showNotification =
    (
      title:
        string,

      message:
        string
    ) => {

      if (
        !alertsEnabledRef
          .current
      ) {

        return;
      }


      if (
        !(
          'Notification'
          in window
        )
      ) {

        return;
      }


      if (
        Notification
          .permission !==
        'granted'
      ) {

        return;
      }


      try {

        const notification =
          new Notification(
            title,
            {
              body:
                message,

              tag:
                `invi-${Date.now()}`,
            }
          );


        window.setTimeout(
          () => {

            notification
              .close();

          },

          8000
        );

      } catch (error) {

        console.error(
          'Notification failed:',
          error
        );
      }
    };


  // ===================================================
  // FORMAT SECONDS
  // ===================================================

  const formatRemaining =
    (
      seconds:
        number
    ) => {

      if (
        seconds >= 60 &&
        seconds % 60 === 0
      ) {

        const minutes =
          seconds / 60;


        return `${minutes} minute${
          minutes === 1
            ? ''
            : 's'
        }`;
      }


      return `${seconds} seconds`;
    };


  // ===================================================
  // UNIVERSAL EVENT
  //
  // ONE EVENT CREATES:
  // 1. ALERT CARD
  // 2. TIMELINE ENTRY
  // 3. BROWSER NOTIFICATION
  // 4. ALARM SOUND
  // ===================================================

  const triggerAlert =
    (
      eventKey:
        string,

      title:
        string,

      message:
        string,

      alarmType:
        AlarmType,

      severity:
        'info' |
        'warning' |
        'critical' =
          'info',

      category:
        TimelineEvent['category'] =
          'alert'
    ) => {

      if (
        firedEventsRef
          .current
          .has(
            eventKey
          )
      ) {

        return;
      }


      firedEventsRef
        .current
        .add(
          eventKey
        );


      const now =
        new Date()
          .toISOString();


      const newAlert:
        SystemAlert = {

        id:
          `alert-${Date.now()}-${Math.random()}`,

        type:
          severity,

        title,

        message,

        timestamp:
          now,
      };


      const newEvent:
        TimelineEvent = {

        id:
          `event-${Date.now()}-${Math.random()}`,

        timestamp:
          now,

        category,

        title,

        details:
          message,

        severity:
          severity ===
          'info'

            ? 'normal'

            : severity,
      };


      setState(
        previous => ({

          ...previous,

          alerts: [
            newAlert,
            ...previous.alerts,
          ].slice(
            0,
            50
          ),

          events: [
            newEvent,
            ...previous.events,
          ].slice(
            0,
            100
          ),
        })
      );


      console.log(
        `[INVI EVENT] ${title} - ${message}`
      );


      if (
        alertsEnabledRef
          .current
      ) {

        void playAlarm(
          alarmType
        );


        showNotification(
          title,
          message
        );
      }
    };


  // ===================================================
  // PROCESS BACKEND CHANGES
  // ===================================================

  const processTransitions =
    (
      snapshot:
        BackendSnapshot,

      settings:
        SystemSettings
    ) => {

      const previous =
        previousSnapshotRef
          .current;


      // First reading = baseline

      if (!previous) {

        previousSnapshotRef
          .current =
            snapshot;


        // If already detected immediately
        // after assignment, still record it.

        if (
          snapshot.status ===
          'READY'
        ) {

          triggerAlert(
            'invigilator-confirmed',

            'Invigilator Confirmed',

            'The assigned invigilator has been detected and confirmed in the examination hall.',

            'confirmation',

            'info',

            'presence'
          );
        }


        return;
      }


      // =================================================
      // ESP32 CONNECTION LOST
      // =================================================

      if (
        previous
          .deviceOnline &&

        !snapshot
          .deviceOnline
      ) {

        triggerAlert(

          `device-offline-${Date.now()}`,

          'ESP32 Connection Lost',

          'The examination hall monitoring device has gone offline.',

          'device-lost',

          'critical',

          'device'
        );
      }


      // =================================================
      // ESP32 RECONNECTED
      // =================================================

      if (
        !previous
          .deviceOnline &&

        snapshot
          .deviceOnline
      ) {

        triggerAlert(

          `device-online-${Date.now()}`,

          'ESP32 Reconnected',

          'The examination hall monitoring device connection has been restored.',

          'device-restored',

          'info',

          'device'
        );
      }


      // =================================================
      // INVIGILATOR CONFIRMED
      // =================================================

      if (
        snapshot.status ===
          'READY' &&

        previous.status !==
          'READY'
      ) {

        triggerAlert(

          'invigilator-confirmed',

          'Invigilator Confirmed',

          'The assigned invigilator has been detected and confirmed in the examination hall.',

          'confirmation',

          'info',

          'presence'
        );
      }


      // =================================================
      // LATE INVIGILATOR ARRIVED
      // =================================================

      if (
        snapshot.status ===
          'LATE_ARRIVED' &&

        previous.status !==
          'LATE_ARRIVED'
      ) {

        triggerAlert(

          'late-arrival-confirmed',

          'Late Invigilator Detected',

          'The assigned invigilator has arrived late and is now confirmed in the examination hall.',

          'confirmation',

          'warning',

          'presence'
        );
      }


      // =================================================
      // PRE-EXAM MISSING WARNINGS
      // =================================================

      if (
        !snapshot
          .presence &&

        snapshot
          .scheduledStartAt
      ) {

        const startTime =
          new Date(
            snapshot
              .scheduledStartAt
          ).getTime();


        const secondsBeforeStart =
          Math.ceil(

            (
              startTime -
              Date.now()
            ) /

            1000
          );


        // FIRST WARNING

        if (
          secondsBeforeStart >
            0 &&

          secondsBeforeStart <=
            Number(
              settings
                .firstMissingWarningSec
            )
        ) {

          triggerAlert(

            'first-missing-warning',

            'Invigilator Missing',

            `The assigned invigilator has not been confirmed. Exam begins in approximately ${formatRemaining(
              Math.max(
                secondsBeforeStart,
                0
              )
            )}.`,

            'warning',

            'warning',

            'alert'
          );
        }


        // CRITICAL WARNING

        if (
          secondsBeforeStart >
            0 &&

          secondsBeforeStart <=
            Number(
              settings
                .criticalWarningSec
            )
        ) {

          triggerAlert(

            'critical-missing-warning',

            'Critical: Invigilator Still Missing',

            'The assigned invigilator is still absent and the examination is about to begin.',

            'critical',

            'critical',

            'alert'
          );
        }
      }


      // =================================================
      // EXAM STARTED
      // =================================================

      if (
        snapshot.status ===
          'EXAM_ACTIVE' &&

        previous.status !==
          'EXAM_ACTIVE' &&

        previous.status !==
          'PRESENCE_LOST'
      ) {

        triggerAlert(

          'exam-started',

          'Examination Started',

          'The official examination timer has started.',

          'start',

          'info',

          'exam'
        );
      }


      // =================================================
      // PRESENCE LOST
      // =================================================

      if (
        snapshot.status ===
          'PRESENCE_LOST' &&

        previous.status !==
          'PRESENCE_LOST'
      ) {

        triggerAlert(

          `presence-lost-${Date.now()}`,

          'Invigilator Presence Lost',

          'The invigilator signal has been lost during the examination.',

          'lost',

          'critical',

          'presence'
        );
      }


      // =================================================
      // PRESENCE RESTORED
      // =================================================

      if (
        previous.status ===
          'PRESENCE_LOST' &&

        snapshot.status ===
          'EXAM_ACTIVE'
      ) {

        triggerAlert(

          `presence-restored-${Date.now()}`,

          'Invigilator Presence Restored',

          'The invigilator signal has been detected again and monitoring has resumed.',

          'restored',

          'info',

          'presence'
        );
      }


      // =================================================
      // EXAM TIME ALERT INTERVALS
      // =================================================

      if (
        snapshot.status ===
          'EXAM_ACTIVE' &&

        snapshot
          .remainingSeconds !==
          null &&

        previous
          .remainingSeconds !==
          null
      ) {

        const intervals =
          Array.isArray(
            settings
              .alertIntervals
          )

            ? settings
                .alertIntervals

            : [];


        for (
          const interval
          of intervals
        ) {

          const seconds =
            Number(
              interval
            );


          // zero handled by completion

          if (
            seconds <= 0
          ) {

            continue;
          }


          if (
            previous
              .remainingSeconds >
              seconds &&

            snapshot
              .remainingSeconds <=
              seconds
          ) {

            triggerAlert(

              `interval-${seconds}`,

              'Exam Time Reminder',

              `${formatRemaining(
                seconds
              )} remaining in the examination.`,

              'reminder',

              'warning',

              'exam'
            );
          }
        }
      }


      // =================================================
      // EXAM COMPLETED
      // =================================================

      if (
        snapshot.status ===
          'COMPLETED' &&

        previous.status !==
          'COMPLETED'
      ) {

        triggerAlert(

          'exam-completed',

          'Time Up — Examination Completed',

          'The examination duration has ended.',

          'end',

          'critical',

          'exam'
        );
      }


      previousSnapshotRef
        .current =
          snapshot;
    };


  // ===================================================
  // LOAD BACKEND STATE
  // ===================================================

  const loadBackendState =
    async () => {

      try {

        const response =
          await fetch(
            `${API_BASE}/api/state`
          );


        if (
          !response.ok
        ) {

          throw new Error(
            `Backend HTTP ${response.status}`
          );
        }


        const data =
          await response
            .json();


        const device =
          data.device ||
          {};


        const presence =
          data.presence ||
          {};


        const assignment =
          data.assignment;


        const backendSettings =
          data.settings ||
          {};


        const exam =
          data.exam ||
          {};


        let status:
          ExamStatus =
            'IDLE';


        if (
          validStatuses
            .includes(
              exam.status
            )
        ) {

          status =
            exam.status;
        }


        const mergedSettings:
          SystemSettings = {

          ...defaultSettings,

          ...backendSettings,
        };


        let activeAssignment:
          InvigilatorAssignment |
          null =
            null;


        if (
          assignment
        ) {

          activeAssignment = {

            invigilatorName:
              assignment
                .invigilatorName ||
              '',

            bleToken:
              assignment
                .bleToken ||
              '',

            examName:
              assignment
                .examName ||
              '',

            scheduledStart:
              assignment
                .scheduledStart ||
              '',

            durationMinutes:
              Number(
                assignment
                  .durationMinutes
              ) || 0,

            assignedAt:
              assignment
                .createdAt ||
              new Date()
                .toISOString(),
          };
        }


        // =================================================
        // NEW ASSIGNMENT
        // =================================================

        const assignmentIdentity =
          assignment
            ?.bleToken

            ? `${assignment.bleToken}-${assignment.scheduledStart || ''}`

            : null;


        if (
          assignmentIdentity !==
          currentAssignmentRef
            .current
        ) {

          currentAssignmentRef
            .current =
              assignmentIdentity;


          firedEventsRef
            .current
            .clear();


          previousSnapshotRef
            .current =
              null;


          setState(
            previous => ({

              ...previous,

              alerts:
                [],

              events:
                [],
            })
          );
        }


        const snapshot:
          BackendSnapshot = {

          status,

          presence:
            presence
              .present ===
            true,

          deviceOnline:
            device
              .online ===
            true,

          remainingSeconds:
            typeof exam
                .remainingSeconds ===
              'number'

              ? exam
                  .remainingSeconds

              : null,

          scheduledStartAt:
            exam
              .scheduledStartAt ||
            null,

          assignmentToken:
            assignment
              ?.bleToken ||
            null,
        };


        processTransitions(
          snapshot,
          mergedSettings
        );


        setState(
          previous => ({

            ...previous,

            hallId:
              device.hall ||
              'HALL-G-04',

            esp32DeviceId:
              device
                .deviceId ||
              'ESP32-HALL-G04',

            sensorConnected:
              device
                .online ===
              true,

            activeAssignment,

            examStatus:
              status,

            presenceConfirmed:
              presence
                .present ===
              true,

            remainingSeconds:
              typeof exam
                  .remainingSeconds ===
                'number'

                ? exam
                    .remainingSeconds

                : null,

            settings:
              mergedSettings,
          })
        );

      } catch (error) {

        console.error(
          'INVI backend unavailable:',
          error
        );


        setState(
          previous => ({

            ...previous,

            sensorConnected:
              false,
          })
        );
      }
    };


  // ===================================================
  // POLLING
  // ===================================================

  useEffect(
    () => {

      loadBackendState();


      const interval =
        window.setInterval(
          loadBackendState,
          1000
        );


      return () => {

        window.clearInterval(
          interval
        );
      };

    },

    []
  );


  // ===================================================
  // ASSIGN INVIGILATOR
  // ===================================================

  const assignInvigilator =
    async (
      assignment:
        InvigilatorAssignment
    ) => {

      try {

        const response =
          await fetch(

            `${API_BASE}/api/assignment`,

            {

              method:
                'POST',

              headers: {

                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {

                    invigilatorName:
                      assignment
                        .invigilatorName,

                    bleToken:
                      assignment
                        .bleToken,

                    examName:
                      assignment
                        .examName,

                    scheduledStart:
                      assignment
                        .scheduledStart,

                    durationMinutes:
                      assignment
                        .durationMinutes,
                  }
                ),
            }
          );


        if (
          !response.ok
        ) {

          throw new Error(
            'Assignment failed'
          );
        }


        firedEventsRef
          .current
          .clear();


        previousSnapshotRef
          .current =
            null;


        await loadBackendState();

      } catch (error) {

        console.error(
          'Assignment error:',
          error
        );


        window.alert(
          'Could not assign invigilator.'
        );
      }
    };


  // ===================================================
  // REMOVE ASSIGNMENT
  // ===================================================

  const removeAssignment =
    async () => {

      try {

        await fetch(
          `${API_BASE}/api/reset`,
          {
            method:
              'POST',
          }
        );


        firedEventsRef
          .current
          .clear();


        previousSnapshotRef
          .current =
            null;


        currentAssignmentRef
          .current =
            null;


        setState(
          previous => ({

            ...previous,

            alerts:
              [],

            events:
              [],
          })
        );


        await loadBackendState();

      } catch (error) {

        console.error(
          'Remove assignment failed:',
          error
        );
      }
    };


  // ===================================================
  // UPDATE SETTINGS
  // ===================================================

  const updateSettings =
    async (
      newSettings:
        Partial<SystemSettings>
    ) => {

      try {

        const response =
          await fetch(

            `${API_BASE}/api/settings`,

            {

              method:
                'PUT',

              headers: {

                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  newSettings
                ),
            }
          );


        if (
          !response.ok
        ) {

          throw new Error(
            'Settings update failed'
          );
        }


        await loadBackendState();

      } catch (error) {

        console.error(
          'Settings error:',
          error
        );


        window.alert(
          'Could not save monitoring settings.'
        );
      }
    };


  // ===================================================
  // ENABLE / DISABLE ALERTS
  // ===================================================

  const toggleAlerts =
    async () => {

      const enable =
        !alertsEnabledRef
          .current;


      if (
        enable
      ) {

        if (
          'Notification'
          in window &&

          Notification
            .permission ===
          'default'
        ) {

          try {

            await Notification
              .requestPermission();

          } catch (error) {

            console.error(
              error
            );
          }
        }


        try {

          const context =
            getAudioContext();


          if (
            context
          ) {

            await context
              .resume();
          }

        } catch (error) {

          console.error(
            error
          );
        }


        alertsEnabledRef
          .current =
            true;


        setState(
          previous => ({

            ...previous,

            alertsEnabled:
              true,
          })
        );


        await beep(
          700,
          250,
          0.8
        );


        await wait(
          100
        );


        await beep(
          900,
          300,
          0.8
        );


        showNotification(

          'INVI Alerts Enabled',

          'Sound alarms and browser notifications are now active.'
        );


        return;
      }


      alertsEnabledRef
        .current =
          false;


      setState(
        previous => ({

          ...previous,

          alertsEnabled:
            false,
        })
      );
    };


  // ===================================================
  // DELAY REASON
  // UNUSED NOW, KEPT FOR TYPE COMPATIBILITY
  // ===================================================

  const submitDelayReason =
    (
      reason:
        DelayReasonOption,

      note:
        string
    ) => {

      setState(
        previous => ({

          ...previous,

          delaySubmission: {

            reason,

            note,

            submittedAt:
              new Date()
                .toISOString(),
          },
        })
      );
    };


  // ===================================================
  // BACKEND CONTROLS STATUS
  // ===================================================

  const setExamStatus =
    (
      _status:
        ExamStatus
    ) => {

      console.log(
        'Exam status is controlled automatically by the backend.'
      );
    };


  const setSensorConnected =
    (
      _connected:
        boolean
    ) => {

      console.log(
        'ESP32 status is controlled automatically by heartbeat.'
      );
    };


  // ===================================================
  // RESET
  // ===================================================

  const resetDemo =
    async () => {

      try {

        await fetch(
          `${API_BASE}/api/reset`,
          {
            method:
              'POST',
          }
        );


        firedEventsRef
          .current
          .clear();


        previousSnapshotRef
          .current =
            null;


        currentAssignmentRef
          .current =
            null;


        setState(
          previous => ({

            ...previous,

            alerts:
              [],

            events:
              [],

            delaySubmission:
              null,
          })
        );


        await loadBackendState();

      } catch (error) {

        console.error(
          'Reset failed:',
          error
        );
      }
    };


  // ===================================================
  // PROVIDER
  // ===================================================

  return (

    <InviContext.Provider
      value={{
        state,

        assignInvigilator,

        removeAssignment,

        updateSettings,

        toggleAlerts,

        submitDelayReason,

        setExamStatus,

        setSensorConnected,

        resetDemo,
      }}
    >

      {children}

    </InviContext.Provider>
  );
};


// =====================================================
// HOOK
// =====================================================

export const useInvi =
  (): InviContextType => {

    const context =
      useContext(
        InviContext
      );


    if (!context) {

      throw new Error(
        'useInvi must be used inside InviProvider'
      );
    }


    return context;
  };