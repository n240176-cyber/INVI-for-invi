import React from 'react';

import {
  History,
  Bluetooth,
  Radio,
  AlertTriangle,
  FileText,
  Clock3,
  CheckCircle2,
} from 'lucide-react';

import { TimelineEvent } from '../../types/invi';
import { EmptyState } from '../common/EmptyState';


interface EventTimelineProps {
  events: TimelineEvent[];
}


export const EventTimeline:
React.FC<EventTimelineProps> = ({
  events,
}) => {

  // =====================================================
  // HUMAN READABLE TIME
  // =====================================================

  const formatTime = (
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


  // =====================================================
  // CATEGORY ICON
  // =====================================================

  const getCategoryIcon = (
    category:
      TimelineEvent['category']
  ) => {

    switch (category) {

      case 'presence':

        return (
          <Bluetooth className="w-3.5 h-3.5 text-[#6F102B]" />
        );


      case 'device':

        return (
          <Radio className="w-3.5 h-3.5 text-blue-600" />
        );


      case 'alert':

        return (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        );


      case 'exam':

      default:

        return (
          <FileText className="w-3.5 h-3.5 text-neutral-600" />
        );
    }
  };


  // =====================================================
  // SEVERITY STYLING
  // =====================================================

  const getEventStyle = (
    severity:
      TimelineEvent['severity']
  ) => {

    if (
      severity === 'critical'
    ) {

      return {
        dot:
          'border-red-300 bg-red-50',

        title:
          'text-red-800',

        label:
          'Critical',

        labelStyle:
          'text-red-700 bg-red-50 border-red-200',
      };
    }


    if (
      severity === 'warning'
    ) {

      return {
        dot:
          'border-amber-300 bg-amber-50',

        title:
          'text-amber-800',

        label:
          'Warning',

        labelStyle:
          'text-amber-700 bg-amber-50 border-amber-200',
      };
    }


    return {
      dot:
        'border-[#D5D1C9] bg-white',

      title:
        'text-[#1C1C21]',

      label:
        'Recorded',

      labelStyle:
        'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  };


  return (

    <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 shadow-2xs">

      {/* HEADER */}

      <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] mb-4">

        <div className="flex items-center gap-2">

          <History className="w-4 h-4 text-[#6F102B]" />

          <div>

            <h3 className="text-[16px] font-semibold text-[#1C1C21]">

              Event Timeline

            </h3>

            <p className="text-[11px] text-[#71717A]">

              Automatic examination monitoring history

            </p>

          </div>

        </div>


        <span className="text-[11px] font-medium text-[#71717A] bg-[#FAF9F7] border border-[#E2DFD9] px-2 py-1 rounded-md">

          {events.length}{' '}

          {events.length === 1
            ? 'event'
            : 'events'}

        </span>

      </div>


      {/* NO EVENTS */}

      {events.length === 0 ? (

        <EmptyState
          icon={History}
          title="No events recorded yet"
          description="Warnings, presence changes, device connectivity and examination events will appear here automatically."
          compact
        />

      ) : (

        <div className="relative pl-7 space-y-5 before:content-[''] before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-[#E2DFD9]">

          {events.map(
            event => {

              const style =
                getEventStyle(
                  event.severity
                );


              return (

                <div
                  key={event.id}
                  className="relative"
                >

                  {/* TIMELINE DOT */}

                  <div
                    className={`absolute -left-7 top-0.5 w-[23px] h-[23px] rounded-full border flex items-center justify-center ${style.dot}`}
                  >

                    {getCategoryIcon(
                      event.category
                    )}

                  </div>


                  {/* EVENT */}

                  <div className="pb-1">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">

                      <div className="flex items-center gap-2 min-w-0">

                        <span
                          className={`text-[13px] font-semibold ${style.title}`}
                        >

                          {event.title}

                        </span>


                        <span
                          className={`hidden sm:inline-flex text-[9px] uppercase tracking-wider border rounded px-1.5 py-0.5 ${style.labelStyle}`}
                        >

                          {style.label}

                        </span>

                      </div>


                      {/* TIME */}

                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#71717A] whitespace-nowrap">

                        <Clock3 className="w-3 h-3" />

                        {formatTime(
                          event.timestamp
                        )}

                      </span>

                    </div>


                    {/* DETAILS */}

                    {event.details && (

                      <p className="text-[12px] text-[#5A5A66] mt-1 leading-relaxed">

                        {event.details}

                      </p>

                    )}

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}


      {/* FOOTER */}

      <div className="mt-5 pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-[11px]">

        <span className="text-[#848492]">

          Events recorded automatically

        </span>


        <span className="flex items-center gap-1 text-emerald-700 font-medium">

          <CheckCircle2 className="w-3.5 h-3.5" />

          Live Monitoring

        </span>

      </div>

    </div>
  );
};