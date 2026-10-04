import React from 'react';
import { ExamStatus } from '../../types/invi';

interface StatusBadgeProps {
  status: ExamStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const getStatusConfig = (s: ExamStatus) => {
    switch (s) {
      case 'IDLE':
        return {
          label: 'IDLE',
          dotColor: 'bg-[#8E8E93]',
          textColor: 'text-[#48484A]',
          bgClass: 'bg-[#F2F2F7] border-[#E5E5EA]',
        };
      case 'AWAITING_INVIGILATOR':
        return {
          label: 'AWAITING INVIGILATOR',
          dotColor: 'bg-[#6F102B]',
          textColor: 'text-[#6F102B]',
          bgClass: 'bg-[#FAF0F3] border-[#F2D6DE]',
        };
      case 'READY':
        return {
          label: 'READY',
          dotColor: 'bg-[#15803D]',
          textColor: 'text-[#15803D]',
          bgClass: 'bg-[#F0FDF4] border-[#DCFCE7]',
        };
      case 'WARNING':
        return {
          label: 'WARNING',
          dotColor: 'bg-[#B45309]',
          textColor: 'text-[#B45309]',
          bgClass: 'bg-[#FFFBEB] border-[#FEF3C7]',
        };
      case 'LATE':
        return {
          label: 'INVIGILATOR LATE',
          dotColor: 'bg-[#B91C1C]',
          textColor: 'text-[#B91C1C]',
          bgClass: 'bg-[#FEF2F2] border-[#FEE2E2]',
        };
      case 'EXAM_ACTIVE':
        return {
          label: 'EXAM ACTIVE',
          dotColor: 'bg-[#6F102B] animate-pulse',
          textColor: 'text-[#6F102B]',
          bgClass: 'bg-[#FAF0F3] border-[#F2D6DE]',
        };
      case 'PRESENCE_CHECK':
        return {
          label: 'PRESENCE CHECK',
          dotColor: 'bg-[#D97706]',
          textColor: 'text-[#B45309]',
          bgClass: 'bg-[#FFFBEB] border-[#FEF3C7]',
        };
      case 'COMPLETED':
        return {
          label: 'COMPLETED',
          dotColor: 'bg-[#15803D]',
          textColor: 'text-[#166534]',
          bgClass: 'bg-[#F0FDF4] border-[#BBF7D0]',
        };
      default:
        return {
          label: 'UNKNOWN',
          dotColor: 'bg-neutral-400',
          textColor: 'text-neutral-700',
          bgClass: 'bg-neutral-50 border-neutral-200',
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-[12px] px-2.5 py-1 gap-2',
    lg: 'text-[13px] px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-wider select-none shrink-0 ${config.bgClass} ${config.textColor} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotColor}`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
};
