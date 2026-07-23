import React from 'react';

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export const Creato4LabLogoMark: React.FC<LogoMarkProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-2xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Dark Forest Green Background */}
      <rect width="200" height="200" rx="36" fill="#1B452B" />

      {/* Organic Wavy Concentric Background Patterns */}
      <g opacity="0.6">
        {/* Concentric rings top-right corner */}
        <circle cx="160" cy="40" r="120" stroke="#12331F" strokeWidth="12" fill="none" />
        <circle cx="160" cy="40" r="95" stroke="#12331F" strokeWidth="12" fill="none" />
        <circle cx="160" cy="40" r="70" stroke="#12331F" strokeWidth="11" fill="none" />
        <circle cx="160" cy="40" r="45" stroke="#12331F" strokeWidth="10" fill="none" />

        {/* Wavy S-curves on left & bottom */}
        <path
          d="M -20 50 C 40 80, 20 140, -10 180"
          stroke="#12331F"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -10 100 C 50 130, 20 180, 60 220"
          stroke="#12331F"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 30 210 C 70 150, 140 180, 210 220"
          stroke="#12331F"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 80 210 C 120 160, 170 190, 220 210"
          stroke="#12331F"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Retro 70s Cream Typography "the Creato4 Lab" */}
      <g fill="#F6F0E0">
        {/* "the" */}
        <text
          x="100"
          y="62"
          textAnchor="middle"
          fontFamily="'Grand Hotel', 'Brush Script MT', cursive"
          fontSize="36"
        >
          the
        </text>

        {/* "Creato4" */}
        <text
          x="100"
          y="114"
          textAnchor="middle"
          fontFamily="'Shrikhand', 'Cooper Black', 'Impact', sans-serif"
          fontSize="41"
          letterSpacing="-0.5px"
        >
          Creato4
        </text>

        {/* "Lab" */}
        <text
          x="100"
          y="162"
          textAnchor="middle"
          fontFamily="'Shrikhand', 'Cooper Black', 'Impact', sans-serif"
          fontSize="41"
          letterSpacing="-0.5px"
        >
          Lab
        </text>
      </g>
    </svg>
  );
};

