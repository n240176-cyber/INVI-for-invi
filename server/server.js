const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =====================================================
// DEVICE STATE
// =====================================================

let deviceState = {
  deviceId: null,
  hall: "HALL-G-04",
  online: false,
  lastHeartbeat: null,
};

// =====================================================
// PRESENCE STATE
// =====================================================

let presenceState = {
  present: false,
  token: null,
  rssi: null,
  lastSeen: null,
};

// =====================================================
// ESP32 CONFIGURATION
// =====================================================

let deviceConfig = {
  deviceId: "ESP32-HALL-G04",
  hall: "HALL-G-04",
  expectedToken: null,
};

// =====================================================
// ASSIGNMENT
// =====================================================

let assignment = null;

// =====================================================
// SETTINGS
// =====================================================

let settings = {
  examName: "",
  scheduledStartTime: "",
  examDurationMinutes: 0,

  invigilatorName: "",
  bleToken: "",

  firstMissingWarningSec: 0,
  criticalWarningSec: 0,

  bleConfirmationDurationSec: 0,

  presenceLossGracePeriodSec: 5,

  deviceHeartbeatTimeoutSec: 15,

  lateArrivalStartDelaySec: 0,

  alertIntervals: [],
};

// =====================================================
// TIMER / EXAM ENGINE STATE
// =====================================================

let examEngine = {
  status: "IDLE",

  scheduledStartAt: null,

  arrivalTime: null,

  actualStartAt: null,

  examEndAt: null,

  remainingSeconds: null,

  lateBySeconds: 0,

  presenceLostSince: null,
};

// =====================================================
// ALERTS / EVENTS
// =====================================================

let alerts = [];
let events = [];

let firedAlertIntervals = new Set();

// =====================================================
// UTILITIES
// =====================================================

function nowISO() {
  return new Date().toISOString();
}

function addEvent(
  category,
  title,
  details = "",
  severity = "normal"
) {
  events.unshift({
    id: `evt-${Date.now()}-${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(
      "en-GB",
      { hour12: false }
    ),
    category,
    title,
    details,
    severity,
  });

  if (events.length > 100) {
    events = events.slice(0, 100);
  }
}

function addAlert(
  type,
  title,
  message,
  severity = "warning"
) {
  const alert = {
    id: `alert-${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    severity,
    createdAt: nowISO(),
  };

  alerts.unshift(alert);

  if (alerts.length > 50) {
    alerts = alerts.slice(0, 50);
  }

  console.log("");
  console.log("ALERT:", title);
  console.log(message);
  console.log("");
}

// =====================================================
// DEVICE ONLINE CALCULATION
// =====================================================

function updateDeviceOnlineState() {
  if (!deviceState.lastHeartbeat) {
    deviceState.online = false;
    return;
  }

  const heartbeatTime =
    new Date(
      deviceState.lastHeartbeat
    ).getTime();

  const timeout =
    Math.max(
      Number(
        settings.deviceHeartbeatTimeoutSec
      ) || 15,
      5
    ) * 1000;

  deviceState.online =
    Date.now() - heartbeatTime <= timeout;
}

// =====================================================
// PARSE SCHEDULED TIME
// =====================================================
//
// Supports:
//
// "14:30"
//
// OR:
//
// "2026-10-03T14:30"
//
// =====================================================

function parseScheduledStart(value) {
  if (!value) {
    return null;
  }

  // HH:MM format
  if (
    /^\d{2}:\d{2}$/.test(value)
  ) {
    const [hours, minutes] =
      value
        .split(":")
        .map(Number);

    const date = new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date;
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return null;
  }

  return parsed;
}

// =====================================================
// RESET TIMER ENGINE
// =====================================================

function resetExamEngine() {
  examEngine = {
    status:
      assignment
        ? "AWAITING_INVIGILATOR"
        : "IDLE",

    scheduledStartAt:
      assignment?.scheduledStart
        ? parseScheduledStart(
            assignment.scheduledStart
          )?.toISOString() || null
        : null,

    arrivalTime: null,

    actualStartAt: null,

    examEndAt: null,

    remainingSeconds: null,

    lateBySeconds: 0,

    presenceLostSince: null,
  };

  firedAlertIntervals.clear();
  alerts = [];
}

// =====================================================
// START EXAM
// =====================================================

function startExam(startTimestamp) {
  if (
    examEngine.status ===
    "EXAM_ACTIVE"
  ) {
    return;
  }

  if (
    examEngine.status ===
    "COMPLETED"
  ) {
    return;
  }

  const durationMinutes =
    Number(
      settings.examDurationMinutes
    ) ||
    Number(
      assignment?.durationMinutes
    ) ||
    0;

  if (durationMinutes <= 0) {
    return;
  }

  const startDate =
    new Date(startTimestamp);

  const endDate =
    new Date(
      startDate.getTime() +
        durationMinutes *
          60 *
          1000
    );

  examEngine.status =
    "EXAM_ACTIVE";

  examEngine.actualStartAt =
    startDate.toISOString();

  examEngine.examEndAt =
    endDate.toISOString();

  addEvent(
    "exam",
    "Exam Started",
    assignment?.examName || "",
    "normal"
  );

  console.log("");
  console.log("==============================");
  console.log("EXAM STARTED");
  console.log(
    "Start:",
    examEngine.actualStartAt
  );
  console.log(
    "End:",
    examEngine.examEndAt
  );
  console.log("==============================");
}

// =====================================================
// TIMER ENGINE
// =====================================================

function runTimerEngine() {
  updateDeviceOnlineState();

  // No assignment
  if (!assignment) {
    examEngine.status = "IDLE";
    examEngine.remainingSeconds = null;
    return;
  }

  const now = Date.now();

  const scheduledDate =
    parseScheduledStart(
      assignment.scheduledStart
    );

  if (!scheduledDate) {
    examEngine.status =
      presenceState.present
        ? "READY"
        : "AWAITING_INVIGILATOR";

    examEngine.remainingSeconds =
      null;

    return;
  }

  const scheduledTime =
    scheduledDate.getTime();

  examEngine.scheduledStartAt =
    scheduledDate.toISOString();

  // ===================================================
  // EXAM ALREADY ACTIVE
  // ===================================================

  if (
    examEngine.status ===
    "EXAM_ACTIVE"
  ) {
    if (!examEngine.examEndAt) {
      return;
    }

    const endTime =
      new Date(
        examEngine.examEndAt
      ).getTime();

    const remaining =
      Math.max(
        0,
        Math.ceil(
          (endTime - now) /
            1000
        )
      );

    examEngine.remainingSeconds =
      remaining;

    // -----------------------------------------------
    // Configurable exam alerts
    // -----------------------------------------------

    const intervals =
      Array.isArray(
        settings.alertIntervals
      )
        ? settings.alertIntervals
        : [];

    for (
      const rawInterval
      of intervals
    ) {
      const interval =
        Number(rawInterval);

      if (
        interval <= 0 ||
        firedAlertIntervals.has(
          interval
        )
      ) {
        continue;
      }

      if (
        remaining <= interval
      ) {
        firedAlertIntervals.add(
          interval
        );

        addAlert(
          "exam-reminder",
          "Exam Reminder",
          `${interval} seconds remaining`,
          "warning"
        );

        addEvent(
          "exam",
          "Exam Reminder",
          `${interval} seconds remaining`,
          "warning"
        );
      }
    }

    // -----------------------------------------------
    // Presence loss during exam
    // -----------------------------------------------

    if (!presenceState.present) {
      if (
        !examEngine
          .presenceLostSince
      ) {
        examEngine.presenceLostSince =
          nowISO();
      }

      const lostAt =
        new Date(
          examEngine
            .presenceLostSince
        ).getTime();

      const lostForSeconds =
        Math.floor(
          (now - lostAt) /
            1000
        );

      const grace =
        Number(
          settings
            .presenceLossGracePeriodSec
        ) || 0;

      if (
        lostForSeconds >= grace &&
        grace > 0
      ) {
        examEngine.status =
          "PRESENCE_LOST";
      }
    } else {
      examEngine.presenceLostSince =
        null;
    }

    // -----------------------------------------------
    // Exam finished
    // -----------------------------------------------

    if (remaining <= 0) {
      examEngine.status =
        "COMPLETED";

      examEngine.remainingSeconds =
        0;

      addAlert(
        "exam-completed",
        "Time Up",
        "The examination duration has ended.",
        "normal"
      );

      addEvent(
        "exam",
        "Exam Completed",
        assignment?.examName || "",
        "normal"
      );
    }

    return;
  }

  // ===================================================
  // RESTORE FROM PRESENCE_LOST
  // ===================================================

  if (
    examEngine.status ===
    "PRESENCE_LOST"
  ) {
    if (presenceState.present) {
      examEngine.status =
        "EXAM_ACTIVE";

      examEngine.presenceLostSince =
        null;

      addEvent(
        "presence",
        "Presence Restored",
        presenceState.token || "",
        "normal"
      );
    }

    // Keep countdown moving
    if (examEngine.examEndAt) {
      const end =
        new Date(
          examEngine.examEndAt
        ).getTime();

      examEngine.remainingSeconds =
        Math.max(
          0,
          Math.ceil(
            (end - now) / 1000
          )
        );
    }

    return;
  }

  // ===================================================
  // INVIGILATOR PRESENT
  // ===================================================

  if (presenceState.present) {
    if (!examEngine.arrivalTime) {
      examEngine.arrivalTime =
        presenceState.lastSeen ||
        nowISO();
    }

    const arrival =
      new Date(
        examEngine.arrivalTime
      ).getTime();

    // -----------------------------------------------
    // Arrived ON TIME
    // -----------------------------------------------

    if (arrival <= scheduledTime) {
      examEngine.lateBySeconds = 0;

      if (now < scheduledTime) {
        examEngine.status =
          "READY";

        examEngine.remainingSeconds =
          Math.ceil(
            (scheduledTime - now) /
              1000
          );

        return;
      }

      // Scheduled time reached
      startExam(
        scheduledDate
      );

      return;
    }

    // -----------------------------------------------
    // Arrived LATE
    // -----------------------------------------------

    examEngine.lateBySeconds =
      Math.max(
        0,
        Math.floor(
          (arrival -
            scheduledTime) /
            1000
        )
      );

    const lateDelaySeconds =
  Number(settings.lateArrivalStartDelaySec) || 0;

const delayedStart =
  arrival +
  lateDelaySeconds * 1000;

    if (now < delayedStart) {
      examEngine.status =
        "LATE_ARRIVED";

      examEngine.remainingSeconds =
        Math.ceil(
          (delayedStart - now) /
            1000
        );

      return;
    }

    startExam(
      new Date(
        delayedStart
      )
    );

    return;
  }

  // ===================================================
  // INVIGILATOR NOT PRESENT
  // ===================================================

  const secondsUntilStart =
    Math.ceil(
      (scheduledTime - now) /
        1000
    );

  examEngine.remainingSeconds =
    Math.max(
      0,
      secondsUntilStart
    );

  // -----------------------------------------------
  // Scheduled time already passed
  // -----------------------------------------------

  if (now >= scheduledTime) {
    examEngine.status =
      "LATE";

    return;
  }

  const firstWarning =
    Number(
      settings
        .firstMissingWarningSec
    ) || 0;

  const criticalWarning =
    Number(
      settings
        .criticalWarningSec
    ) || 0;

  if (
    criticalWarning > 0 &&
    secondsUntilStart <=
      criticalWarning
  ) {
    examEngine.status =
      "WARNING_MISSING";

    return;
  }

  if (
    firstWarning > 0 &&
    secondsUntilStart <=
      firstWarning
  ) {
    examEngine.status =
      "WARNING_MISSING";

    return;
  }

  examEngine.status =
    "AWAITING_INVIGILATOR";
}

// Run timer engine once every second
setInterval(
  runTimerEngine,
  1000
);

// =====================================================
// COMPLETE STATE
// =====================================================

function getState() {
  runTimerEngine();

  return {
    device: deviceState,

    presence: presenceState,

    config: deviceConfig,

    assignment,

    settings,

    exam: examEngine,

    alerts,

    events,
  };
}



// =====================================================
// COMPLETE STATE
// =====================================================

app.get(
  "/api/state",
  (req, res) => {
    res.json(
      getState()
    );
  }
);

// =====================================================
// HEARTBEAT
// =====================================================

app.post(
  "/api/device/heartbeat",
  (req, res) => {

    const {
      deviceId,
      hall,
    } = req.body;

    if (!deviceId) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "deviceId is required",
        });
    }

    const previouslyOnline =
      deviceState.online;

    deviceState.deviceId =
      deviceId;

    deviceState.hall =
      hall || "HALL-G-04";

    deviceState.online = true;

    deviceState.lastHeartbeat =
      nowISO();

    if (!previouslyOnline) {
      addEvent(
        "device",
        "ESP32 Connected",
        deviceId,
        "normal"
      );
    }

    console.log(
      `Heartbeat: ${deviceId} | ${deviceState.lastHeartbeat}`
    );

    res.json({
      success: true,
      device: deviceState,
    });
  }
);

// =====================================================
// ESP32 PRESENCE
// =====================================================

app.post(
  "/api/presence",
  (req, res) => {

    const {
      deviceId,
      token,
      present,
      rssi,
    } = req.body;

    if (
      !deviceId ||
      !token
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "deviceId and token are required",
        });
    }

    const previousPresence =
      presenceState.present;

    presenceState.present =
      present === true;

    presenceState.token =
      token;

    presenceState.rssi =
      rssi ?? null;

    presenceState.lastSeen =
      nowISO();

    // -----------------------------------------------
    // Arrival detection
    // -----------------------------------------------

    if (
      !previousPresence &&
      presenceState.present
    ) {
      examEngine.arrivalTime =
        presenceState.lastSeen;

      addEvent(
        "presence",
        "Invigilator Detected",
        token,
        "normal"
      );
    }

    // -----------------------------------------------
    // Presence lost
    // -----------------------------------------------

    if (
      previousPresence &&
      !presenceState.present
    ) {
      examEngine.presenceLostSince =
        nowISO();

      addEvent(
        "presence",
        "Invigilator Signal Lost",
        token,
        "warning"
      );
    }

    runTimerEngine();

    console.log(
      `Presence: ${token} | ${presenceState.present} | RSSI ${presenceState.rssi}`
    );

    res.json({
      success: true,

      presence:
        presenceState,

      exam:
        examEngine,
    });
  }
);

// =====================================================
// DEVICE ROUTES
// =====================================================

app.get(
  "/api/device",
  (req, res) => {

    updateDeviceOnlineState();

    res.json(
      deviceState
    );
  }
);

app.get(
  "/api/presence",
  (req, res) => {

    res.json(
      presenceState
    );
  }
);

// =====================================================
// ESP32 CONFIG
// =====================================================

app.get(
  "/api/device/config",
  (req, res) => {

    res.json(
      deviceConfig
    );
  }
);

app.post(
  "/api/device/config",
  (req, res) => {

    const {
      expectedToken,
    } = req.body;

    deviceConfig.expectedToken =
      expectedToken || null;

    presenceState = {
      present: false,
      token: null,
      rssi: null,
      lastSeen: null,
    };

    examEngine.arrivalTime =
      null;

    res.json({
      success: true,

      config:
        deviceConfig,
    });
  }
);

// =====================================================
// CREATE ASSIGNMENT
// =====================================================

app.post(
  "/api/assignment",
  (req, res) => {

    const {
      invigilatorName,
      bleToken,
      examName,
      scheduledStart,
      durationMinutes,
    } = req.body;

    if (
      !invigilatorName ||
      !bleToken
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invigilator name and BLE token are required",
        });
    }

    assignment = {
      invigilatorName,

      bleToken,

      examName:
        examName || "",

      scheduledStart:
        scheduledStart || "",

      durationMinutes:
        Number(
          durationMinutes
        ) || 0,

      createdAt:
        nowISO(),
    };

    // ESP32 target
    deviceConfig.expectedToken =
      bleToken;

    // Synchronise settings
    settings.invigilatorName =
      invigilatorName;

    settings.bleToken =
      bleToken;

    settings.examName =
      examName || "";

    settings.scheduledStartTime =
      scheduledStart || "";

    settings.examDurationMinutes =
      Number(
        durationMinutes
      ) || 0;

    // Reset presence for new assignment
    presenceState = {
      present: false,
      token: null,
      rssi: null,
      lastSeen: null,
    };

    resetExamEngine();

    addEvent(
      "exam",
      "Invigilator Assigned",
      `${invigilatorName}${
        examName
          ? ` — ${examName}`
          : ""
      }`,
      "normal"
    );

    console.log("");
    console.log("==============================");
    console.log("NEW ASSIGNMENT");
    console.log(
      "Invigilator:",
      invigilatorName
    );
    console.log(
      "Token:",
      bleToken
    );
    console.log(
      "Scheduled:",
      scheduledStart
    );
    console.log("==============================");

    res.json({
      success: true,

      assignment,

      exam:
        examEngine,
    });
  }
);

// =====================================================
// GET ASSIGNMENT
// =====================================================

app.get(
  "/api/assignment",
  (req, res) => {

    res.json(
      assignment
    );
  }
);

// =====================================================
// SETTINGS
// =====================================================

app.put(
  "/api/settings",
  (req, res) => {

    settings = {
      ...settings,
      ...req.body,
    };

    console.log("");
    console.log(
      "SETTINGS UPDATED"
    );
    console.log(
      settings
    );

    runTimerEngine();

    res.json({
      success: true,
      settings,
    });
  }
);

app.get(
  "/api/settings",
  (req, res) => {

    res.json(
      settings
    );
  }
);

// =====================================================
// RESET
// =====================================================

app.post(
  "/api/reset",
  (req, res) => {

    assignment = null;

    deviceConfig.expectedToken =
      null;

    presenceState = {
      present: false,
      token: null,
      rssi: null,
      lastSeen: null,
    };

    settings = {
      ...settings,

      examName: "",

      scheduledStartTime: "",

      examDurationMinutes: 0,

      invigilatorName: "",

      bleToken: "",
    };

    events = [];
    alerts = [];

    resetExamEngine();

    console.log(
      "INVI SYSTEM RESET"
    );

    res.json({
      success: true,
    });
  }
);

// =====================================================
// START SERVER
// =====================================================
// =====================================================
// SERVE REACT FRONTEND
// =====================================================

const clientDistPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api/")
  ) {
    return res.sendFile(
      path.join(clientDistPath, "index.html")
    );
  }

  next();
});

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("");
    console.log("==============================");
    console.log(
      "INVI TIMER BACKEND STARTED"
    );
    console.log(
      `http://localhost:${PORT}`
    );
    console.log(
      "Hall: HALL-G-04"
    );
    console.log("==============================");
  }
);