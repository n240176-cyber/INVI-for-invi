import React from 'react';

import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock3,
} from 'lucide-react';

import { SystemAlert } from '../../types/invi';
import { EmptyState } from '../common/EmptyState';


interface AlertPanelProps {
  alerts: SystemAlert[];
  alertsEnabled: boolean;
  onToggleAlerts: () => void;
}


export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  alertsEnabled,
  onToggleAlerts,
}) => {

  // Convert ugly ISO time:
  // 2026-10-04T10:08:00.883Z
  //
  // into:
  // 3:38:00 PM

  const formatAlertTime = (
    timestamp: string
  ) => {

    try {

      const date =
        new Date(timestamp);


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return timestamp;
      }


      return date.toLocaleTimeString(
        [],
        {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }
      );

    } catch {

      return timestamp;
    }
  };


  return (

    <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 flex flex-col justify-between shadow-2xs">

      <div>

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] mb-4">

          <div className="flex items-center gap-2">

            <Bell className="w-4 h-4 text-[#6F102B]" />

            <h3 className="text-[16px] font-semibold text-[#1C1C21]">

              Active Alerts

            </h3>


            {alerts.length > 0 && (

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">

                {alerts.length}

              </span>

            )}

          </div>


          <button
            onClick={
              onToggleAlerts
            }

            className={`text-[12px] font-medium px-2 py-1 rounded transition-colors ${
              alertsEnabled

                ? 'text-[#15803D] bg-[#F0FDF4] border border-[#DCFCE7]'

                : 'text-[#71717A] bg-[#FAF9F7] border border-[#E2DFD9]'
            }`}
          >

            {
              alertsEnabled
                ? 'Alerts Armed'
                : 'Alerts Muted'
            }

          </button>

        </div>


        {/* =========================================
            NO ALERTS
        ========================================= */}

        {alerts.length === 0 ? (

          <EmptyState
            icon={Bell}

            title="No active alerts"

            description="System is nominal. Missing invigilator warnings, connection changes and examination alerts will appear here automatically."

            compact
          />

        ) : (

          /* =========================================
             ALERT LIST
          ========================================= */

          <div className="space-y-2.5">

            {alerts.map(
              alert => (

                <div
                  key={
                    alert.id
                  }

                  className={`p-3 rounded-md border text-[13px] flex items-start gap-2.5 ${
                    alert.type ===
                    'critical'

                      ? 'bg-red-50/70 border-red-200 text-red-900'

                      : alert.type ===
                        'warning'

                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'

                      : 'bg-blue-50/70 border-blue-200 text-blue-900'
                  }`}
                >

                  {/* ICON */}

                  {
                    alert.type ===
                    'critical' ? (

                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />

                    ) : alert.type ===
                      'warning' ? (

                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />

                    ) : (

                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />

                    )
                  }


                  <div className="flex-1 min-w-0">

                    {/* TITLE + TIME */}

                    <div className="flex items-start justify-between gap-3">

                      <span className="font-semibold">

                        {alert.title}

                      </span>


                      <span className="text-[11px] opacity-75 whitespace-nowrap flex items-center gap-1">

                        <Clock3 className="w-3 h-3" />

                        {formatAlertTime(
                          alert.timestamp
                        )}

                      </span>

                    </div>


                    {/* MESSAGE */}

                    <p className="text-[12px] mt-1 opacity-90">

                      {alert.message}

                    </p>


                    {/* HUMAN-FRIENDLY NOTE */}

                    <div className="text-[10px] opacity-60 mt-1">

                      Notification sent at{' '}

                      {formatAlertTime(
                        alert.timestamp
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-[12px] text-[#71717A]">

        <span>
          Monitoring mode: Automated
        </span>


        <span
          className={
            alertsEnabled
              ? 'text-emerald-700 font-medium'
              : ''
          }
        >

          {alertsEnabled
            ? 'Notifications Active'
            : 'Notifications Muted'}

        </span>

      </div>

    </div>
  );
};