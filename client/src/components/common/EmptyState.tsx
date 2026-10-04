import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center border border-dashed border-[#D5D1C9] rounded-lg bg-[#FAF9F7]/70 ${
        compact ? 'p-4 min-h-[110px]' : 'p-6 min-h-[160px]'
      } ${className}`}
    >
      {Icon && (
        <div className="w-8 h-8 rounded-full bg-white border border-[#E2DFD9] flex items-center justify-center text-[#71717A] mb-2.5 shadow-xs">
          <Icon className="w-4 h-4 text-[#848492]" />
        </div>
      )}
      <p className="text-[14px] font-medium text-[#2B2B30]">{title}</p>
      {description && (
        <p className="text-[13px] text-[#71717A] mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
};
