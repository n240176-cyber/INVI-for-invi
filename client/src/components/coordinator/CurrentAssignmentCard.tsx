import React from 'react';

import {
  UserCheck,
  Bluetooth,
  Calendar,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';

import { InvigilatorAssignment } from '../../types/invi';
import { EmptyState } from '../common/EmptyState';


interface CurrentAssignmentCardProps {
  assignment: InvigilatorAssignment | null;
  onOpenAssignModal: () => void;
  onRemoveAssignment: () => void;
}


export const CurrentAssignmentCard:
React.FC<CurrentAssignmentCardProps> = ({
  assignment,
  onOpenAssignModal,
  onRemoveAssignment,
}) => {

  return (

    <div className="bg-white border border-[#E2DFD9] rounded-lg p-4 sm:p-5 flex flex-col justify-between shadow-2xs">

      <div>

        {/* HEADER */}

        <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] mb-4">

          <div className="flex items-center gap-2">

            <UserCheck className="w-4 h-4 text-[#6F102B]" />

            <h3 className="text-[16px] font-semibold text-[#1C1C21]">
              Current Assignment
            </h3>

          </div>


          {assignment && (

            <button
              onClick={onRemoveAssignment}
              className="text-[12px] text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
            >

              <Trash2 className="w-3.5 h-3.5" />

              Remove

            </button>

          )}

        </div>


        {/* ASSIGNMENT EXISTS */}

        {assignment ? (

          <div className="space-y-3">

            <div className="flex items-start justify-between gap-4">

              {/* INVIGILATOR */}

              <div>

                <p className="text-[12px] font-medium text-[#71717A] uppercase tracking-wider">
                  Assigned Invigilator
                </p>

                <p className="text-[17px] font-semibold text-[#1C1C21] mt-0.5">
                  {assignment.invigilatorName}
                </p>

              </div>


              {/* BLE TOKEN */}

              <div className="text-right">

                <p className="text-[12px] font-medium text-[#71717A] uppercase tracking-wider">
                  BLE Token
                </p>

                <span className="font-mono text-[13px] bg-[#FAF9F7] border border-[#E2DFD9] px-2 py-0.5 rounded text-[#2B2B30] inline-flex items-center gap-1 mt-0.5">

                  <Bluetooth className="w-3 h-3 text-[#6F102B]" />

                  {assignment.bleToken}

                </span>

              </div>

            </div>


            {/* EXAM DETAILS */}

            <div className="pt-2 border-t border-[#F2EFEB] grid grid-cols-2 gap-3 text-[13px]">

              <div>

                <span className="text-[11px] text-[#71717A] block">
                  Paper / Exam
                </span>

                <span className="font-medium text-[#2B2B30] flex items-center gap-1 mt-0.5">

                  <Calendar className="w-3.5 h-3.5 text-[#848492]" />

                  {assignment.examName}

                </span>

              </div>


              <div>

                <span className="text-[11px] text-[#71717A] block">
                  Scheduled Start
                </span>

                <span className="font-medium text-[#2B2B30] flex items-center gap-1 mt-0.5">

                  <Clock className="w-3.5 h-3.5 text-[#848492]" />

                  {assignment.scheduledStart || 'Not configured'}

                </span>


                {assignment.durationMinutes ? (

                  <span className="text-[11px] text-[#848492] mt-0.5 block ml-[18px]">
                    Duration: {assignment.durationMinutes} min
                  </span>

                ) : null}

              </div>

            </div>

          </div>

        ) : (

          /* NO ASSIGNMENT */

          <EmptyState
            icon={UserCheck}
            title="No invigilator assigned"
            description="Create an assignment to begin monitoring this hall."
            action={

              <button
                onClick={onOpenAssignModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-white bg-[#6F102B] hover:bg-[#5A0C22] rounded-md transition-colors shadow-2xs"
              >

                <Plus className="w-4 h-4" />

                Assign Invigilator

              </button>

            }
          />

        )}

      </div>


      {/* EDIT */}

      {assignment && (

        <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex justify-end">

          <button
            onClick={onOpenAssignModal}
            className="text-[12px] font-medium text-[#6F102B] hover:text-[#5A0C22] hover:underline"
          >

            Edit Assignment Details →

          </button>

        </div>

      )}

    </div>
  );
};