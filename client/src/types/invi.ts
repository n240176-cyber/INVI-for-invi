export type ExamStatus =
  | 'IDLE'
  | 'AWAITING_INVIGILATOR'
  | 'READY'
  | 'WARNING_MISSING'
  | 'LATE'
  | 'LATE_ARRIVED'
  | 'EXAM_ACTIVE'
  | 'PRESENCE_LOST'
  | 'COMPLETED';

export type DelayReasonOption =
  | 'Traffic'
  | 'Previous examination duty'
  | 'Department work'
  | 'Emergency'
  | 'Technical issue'
  | 'Other';

export interface InvigilatorAssignment {
  invigilatorName: string;
  bleToken: string;
  examName: string;
  scheduledStart: string;
  durationMinutes: number;
  assignedAt: string;
}

export interface SystemSettings {
  examName: string;
  scheduledStartTime: string;
  examDurationMinutes: number;

  invigilatorName: string;
  bleToken: string;

  // All stored in seconds
  firstMissingWarningSec: number;
  criticalWarningSec: number;
  bleConfirmationDurationSec: number;
  presenceLossGracePeriodSec: number;
  deviceHeartbeatTimeoutSec: number;

  // Changed from minutes to seconds
  lateArrivalStartDelaySec: number;

  // All alert intervals stored internally in seconds.
  // Example:
  // 5 min = 300
  // 2 min = 120
  // 30 sec = 30
  // time up = 0
  alertIntervals: number[];
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  category: 'presence' | 'exam' | 'device' | 'alert';
  title: string;
  details?: string;
  severity?: 'normal' | 'warning' | 'critical';
}

export interface DelaySubmission {
  reason: DelayReasonOption;
  note: string;
  submittedAt: string;
}

export interface SystemState {
  hallId: string;
  esp32DeviceId: string;
  sensorConnected: boolean;

  activeAssignment: InvigilatorAssignment | null;

  examStatus: ExamStatus;

  alertsEnabled: boolean;

  settings: SystemSettings;

  alerts: SystemAlert[];
  events: TimelineEvent[];

  delaySubmission: DelaySubmission | null;

  presenceConfirmed: boolean;

  remainingSeconds: number | null;
}