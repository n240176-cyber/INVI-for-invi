import React from 'react';

interface InviLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Official INVI Logo Component
 * Faithfully reproduces the architectural door motif, peach doorway frame,
 * and burgundy invigilator silhouette from the uploaded design asset.
 */
export const InviLogo: React.FC<InviLogoProps> = ({
  className = '',
  size = 36,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
        aria-label="INVI Logo"
      >
        {/* Peach Door Frame Header & Right Column */}
        <path
          d="M99 24.5L160.5 51.5V107L144 97.5V62L99 43.5V24.5Z"
          fill="#FBAF8B"
        />

        {/* Burgundy Open Door Panel (Swung Isometric Portal) */}
        <path
          d="M39 51.5L99 24.5V181.5L39 152.5V51.5Z"
          fill="#6F102B"
        />

        {/* Invigilator Head */}
        <circle cx="123" cy="96" r="13" fill="#6F102B" />

        {/* Invigilator Torso and Angled Attendance Register/Tablet */}
        <path
          d="M103.5 122.5C103.5 116 112 110.5 123 110.5C134 110.5 139.5 114.5 140 120L126 139H103.5V122.5Z"
          fill="#6F102B"
        />
        <path
          d="M103.5 122.5V144.5L126 158.5L174.5 124V103.5L126 137.5L103.5 122.5Z"
          fill="#6F102B"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[20px] font-bold tracking-tight text-[#1C1C21]">
              INVI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9A77D]" />
          </div>
          <span className="text-[11px] font-medium tracking-wide text-[#71717A] uppercase">
            Examination Monitoring System
          </span>
        </div>
      )}
    </div>
  );
};
