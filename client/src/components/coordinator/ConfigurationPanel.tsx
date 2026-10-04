import React, { useState } from 'react';

import {
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

import { SystemSettings } from '../../types/invi';


interface ConfigurationPanelProps {
  settings: SystemSettings;

  onSave: (
    settings: SystemSettings
  ) => void;
}


export const ConfigurationPanel:
React.FC<ConfigurationPanelProps> = ({
  settings,
  onSave,
}) => {

  const [formData, setFormData] =
    useState<SystemSettings>(
      settings
    );


  const [
    newInterval,
    setNewInterval,
  ] = useState<string>('');


  const [
    newIntervalUnit,
    setNewIntervalUnit,
  ] =
    useState<'sec' | 'min'>(
      'sec'
    );


  const [
    saveSuccess,
    setSaveSuccess,
  ] =
    useState<boolean>(
      false
    );


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (
    field:
      keyof SystemSettings,

    value:
      number
  ) => {

    setFormData(
      prev => ({
        ...prev,

        [field]:
          value,
      })
    );


    setSaveSuccess(
      false
    );
  };


  // =====================================================
  // ADD ALERT INTERVAL
  // =====================================================

  const handleAddInterval =
    () => {

      const enteredValue =
        parseInt(
          newInterval,
          10
        );


      if (
        isNaN(
          enteredValue
        ) ||

        enteredValue < 0
      ) {

        return;
      }


      const seconds =
        newIntervalUnit ===
        'min'

          ? enteredValue *
            60

          : enteredValue;


      if (
        !formData
          .alertIntervals
          .includes(
            seconds
          )
      ) {

        setFormData(
          prev => ({

            ...prev,

            alertIntervals: [
              ...prev
                .alertIntervals,

              seconds,

            ].sort(
              (
                a,
                b
              ) =>
                b - a
            ),
          })
        );
      }


      setNewInterval(
        ''
      );


      setSaveSuccess(
        false
      );
    };


  // =====================================================
  // REMOVE ALERT INTERVAL
  // =====================================================

  const handleRemoveInterval =
    (
      indexToRemove:
        number
    ) => {

      setFormData(
        prev => ({

          ...prev,

          alertIntervals:
            prev
              .alertIntervals
              .filter(
                (
                  _,
                  index
                ) =>
                  index !==
                  indexToRemove
              ),
        })
      );


      setSaveSuccess(
        false
      );
    };


  // =====================================================
  // FORMAT ALERT INTERVAL
  // =====================================================

  const formatInterval =
    (
      seconds:
        number
    ) => {

      if (
        seconds === 0
      ) {

        return 'Time Up';
      }


      if (
        seconds >= 60 &&
        seconds % 60 ===
          0
      ) {

        const minutes =
          seconds / 60;


        return `${minutes} min${
          minutes === 1
            ? ''
            : 's'
        } remaining`;
      }


      return `${seconds} sec remaining`;
    };


  // =====================================================
  // SAVE
  //
  // Keep latest assignment/exam data from "settings"
  // and change only monitoring values from this panel.
  // =====================================================

  const handleSubmit =
    (
      e:
        React.FormEvent
    ) => {

      e.preventDefault();


      const finalSettings:
        SystemSettings = {

        ...settings,


        firstMissingWarningSec:
          formData
            .firstMissingWarningSec,


        criticalWarningSec:
          formData
            .criticalWarningSec,


        bleConfirmationDurationSec:
          formData
            .bleConfirmationDurationSec,


        presenceLossGracePeriodSec:
          formData
            .presenceLossGracePeriodSec,


        deviceHeartbeatTimeoutSec:
          formData
            .deviceHeartbeatTimeoutSec,


        lateArrivalStartDelaySec:
          formData
            .lateArrivalStartDelaySec,


        alertIntervals:
          formData
            .alertIntervals,
      };


      onSave(
        finalSettings
      );


      setSaveSuccess(
        true
      );


      window.setTimeout(
        () => {

          setSaveSuccess(
            false
          );

        },

        3000
      );
    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="bg-white border border-[#E2DFD9] rounded-lg p-5 sm:p-6 shadow-2xs">

      {/* HEADER */}

      <div className="flex items-center justify-between pb-4 border-b border-[#EAE7E1] mb-6">

        <div className="flex items-center gap-2">

          <Sliders className="w-5 h-5 text-[#6F102B]" />


          <div>

            <h3 className="text-[17px] font-semibold text-[#1C1C21]">

              Monitoring Threshold Settings

            </h3>


            <p className="text-[12px] text-[#71717A]">

              Configure warning,
              presence and hardware
              monitoring timings

            </p>

          </div>

        </div>


        {saveSuccess && (

          <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">

            <CheckCircle2 className="w-4 h-4 text-emerald-600" />

            Settings Saved

          </div>

        )}

      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >

        {/* ============================================
            THRESHOLD SETTINGS
        ============================================ */}

        <div>

          <h4 className="text-[13px] font-semibold text-[#6F102B] uppercase tracking-wider mb-3">

            Pre-Exam & Presence Monitoring

          </h4>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">


            {/* FIRST MISSING WARNING */}

            <div>

              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">

                First Missing Warning

              </label>


              <div className="relative">

                <input
                  type="number"
                  min="1"

                  value={
                    formData
                      .firstMissingWarningSec ||
                    ''
                  }

                  onChange={
                    e =>
                      handleInputChange(
                        'firstMissingWarningSec',

                        parseInt(
                          e.target
                            .value,
                          10
                        ) || 0
                      )
                  }

                  placeholder="60"

                  className="w-full h-10 pl-3 pr-12 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />


                <span className="absolute right-3 top-2.5 text-[12px] text-[#71717A] pointer-events-none">

                  sec

                </span>

              </div>


              <span className="text-[11px] text-[#848492] mt-1 block">

                First alert if the
                invigilator is still
                missing before exam start

              </span>

            </div>


            {/* CRITICAL WARNING */}

            <div>

              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">

                Critical Warning

              </label>


              <div className="relative">

                <input
                  type="number"
                  min="1"

                  value={
                    formData
                      .criticalWarningSec ||
                    ''
                  }

                  onChange={
                    e =>
                      handleInputChange(
                        'criticalWarningSec',

                        parseInt(
                          e.target
                            .value,
                          10
                        ) || 0
                      )
                  }

                  placeholder="30"

                  className="w-full h-10 pl-3 pr-12 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />


                <span className="absolute right-3 top-2.5 text-[12px] text-[#71717A] pointer-events-none">

                  sec

                </span>

              </div>


              <span className="text-[11px] text-[#848492] mt-1 block">

                Critical alert close
                to examination start

              </span>

            </div>


            {/* BLE CONFIRMATION */}

            <div>

              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">

                BLE Confirmation Duration

              </label>


              <div className="relative">

                <input
                  type="number"
                  min="1"

                  value={
                    formData
                      .bleConfirmationDurationSec ||
                    ''
                  }

                  onChange={
                    e =>
                      handleInputChange(
                        'bleConfirmationDurationSec',

                        parseInt(
                          e.target
                            .value,
                          10
                        ) || 0
                      )
                  }

                  placeholder="10"

                  className="w-full h-10 pl-3 pr-12 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />


                <span className="absolute right-3 top-2.5 text-[12px] text-[#71717A] pointer-events-none">

                  sec

                </span>

              </div>


              <span className="text-[11px] text-[#848492] mt-1 block">

                Continuous BLE signal
                required before confirming
                presence

              </span>

            </div>


            {/* PRESENCE LOSS */}

            <div>

              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">

                Presence-Loss Grace Period

              </label>


              <div className="relative">

                <input
                  type="number"
                  min="1"

                  value={
                    formData
                      .presenceLossGracePeriodSec ||
                    ''
                  }

                  onChange={
                    e =>
                      handleInputChange(
                        'presenceLossGracePeriodSec',

                        parseInt(
                          e.target
                            .value,
                          10
                        ) || 0
                      )
                  }

                  placeholder="10"

                  className="w-full h-10 pl-3 pr-12 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />


                <span className="absolute right-3 top-2.5 text-[12px] text-[#71717A] pointer-events-none">

                  sec

                </span>

              </div>


              <span className="text-[11px] text-[#848492] mt-1 block">

                Time allowed before a
                missing-presence alert

              </span>

            </div>


            {/* HEARTBEAT */}

            <div>

              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">

                Device Heartbeat Timeout

              </label>


              <div className="relative">

                <input
                  type="number"
                  min="1"

                  value={
                    formData
                      .deviceHeartbeatTimeoutSec ||
                    ''
                  }

                  onChange={
                    e =>
                      handleInputChange(
                        'deviceHeartbeatTimeoutSec',

                        parseInt(
                          e.target
                            .value,
                          10
                        ) || 0
                      )
                  }

                  placeholder="15"

                  className="w-full h-10 pl-3 pr-12 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />


                <span className="absolute right-3 top-2.5 text-[12px] text-[#71717A] pointer-events-none">

                  sec

                </span>

              </div>


              <span className="text-[11px] text-[#848492] mt-1 block">

                ESP32 is treated as
                offline after this time

              </span>

            </div>


            {/* LATE ARRIVAL */}

            <div>

              <label className="block text-[12px] font-medium text-[#2B2B30] mb-1.5">

                Late-Arrival Start Delay

              </label>


              <div className="relative">

                <input
                  type="number"
                  min="0"

                  value={
                    formData
                      .lateArrivalStartDelaySec ??
                    ''
                  }

                  onChange={
                    e =>
                      handleInputChange(
                        'lateArrivalStartDelaySec',

                        parseInt(
                          e.target
                            .value,
                          10
                        ) || 0
                      )
                  }

                  placeholder="30"

                  className="w-full h-10 pl-3 pr-12 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
                />


                <span className="absolute right-3 top-2.5 text-[12px] text-[#71717A] pointer-events-none">

                  sec

                </span>

              </div>


              <span className="text-[11px] text-[#848492] mt-1 block">

                Delay after a late
                invigilator is detected
                before timer starts

              </span>

            </div>

          </div>

        </div>


        {/* ============================================
            EXAM ALERT INTERVALS
        ============================================ */}

        <div className="pt-5 border-t border-[#F2EFEB]">

          <h4 className="text-[13px] font-semibold text-[#6F102B] uppercase tracking-wider mb-2">

            Exam Alert Intervals

          </h4>


          <p className="text-[12px] text-[#71717A] mb-3">

            Configure remaining-time
            notifications during an active
            examination.

          </p>


          {/* EXISTING INTERVALS */}

          <div className="flex flex-wrap items-center gap-2 mb-4">

            {
              formData
                .alertIntervals
                .map(
                  (
                    interval,
                    index
                  ) => (

                    <span
                      key={
                        `${interval}-${index}`
                      }

                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F7] border border-[#D5D1C9] rounded-md text-[13px] text-[#2B2B30]"
                    >

                      <span className="font-medium">

                        {
                          formatInterval(
                            interval
                          )
                        }

                      </span>


                      <button
                        type="button"

                        onClick={
                          () =>
                            handleRemoveInterval(
                              index
                            )
                        }

                        className="text-[#848492] hover:text-red-600 transition-colors p-0.5"
                      >

                        <Trash2 className="w-3.5 h-3.5" />

                      </button>

                    </span>

                  )
                )
            }


            {
              formData
                .alertIntervals
                .length ===
                0 && (

                <span className="text-[13px] text-[#71717A] italic">

                  No alert intervals configured

                </span>

              )
            }

          </div>


          {/* ADD INTERVAL */}

          <div className="flex flex-wrap items-center gap-2">

            <input
              type="number"
              min="0"

              value={
                newInterval
              }

              onChange={
                e =>
                  setNewInterval(
                    e.target
                      .value
                  )
              }

              placeholder="e.g. 30"

              className="h-10 w-32 px-3 text-[14px] bg-white border border-[#D5D1C9] rounded-md text-[#1C1C21] placeholder:text-[#9C9CA4] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
            />


            <select
              value={
                newIntervalUnit
              }

              onChange={
                e =>
                  setNewIntervalUnit(
                    e.target
                      .value as
                      | 'sec'
                      | 'min'
                  )
              }

              className="h-10 px-3 text-[13px] bg-white border border-[#D5D1C9] rounded-md text-[#2B2B30] focus:outline-hidden focus:border-[#6F102B] focus:ring-1 focus:ring-[#6F102B]"
            >

              <option value="sec">

                Seconds

              </option>


              <option value="min">

                Minutes

              </option>

            </select>


            <button
              type="button"

              onClick={
                handleAddInterval
              }

              className="h-10 px-3 text-[13px] font-medium bg-[#FAF9F7] text-[#2B2B30] hover:bg-[#F2EFEB] border border-[#D5D1C9] rounded-md transition-colors flex items-center gap-1"
            >

              <Plus className="w-4 h-4 text-[#6F102B]" />

              Add alert interval

            </button>

          </div>


          <p className="text-[11px] text-[#848492] mt-2">

            Example: 2 minutes,
            1 minute,
            30 seconds and
            Time Up.

          </p>

        </div>


        {/* ============================================
            SAVE
        ============================================ */}

        <div className="pt-5 border-t border-[#EAE7E1] flex items-center justify-end">

          <button
            type="submit"

            className="px-5 py-2.5 text-[14px] font-semibold text-white bg-[#6F102B] hover:bg-[#5A0C22] rounded-md transition-colors shadow-2xs cursor-pointer"
          >

            Save Monitoring Settings

          </button>

        </div>

      </form>

    </div>
  );
};