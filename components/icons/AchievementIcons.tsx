import React from 'react';

export const StreakIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0122 12c0 3.314-2 6.314-5.014 7.014A8 8 0 0117.657 18.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.522 16.522a4.5 4.5 0 01-6.364-6.364 4.5 4.5 0 016.364 6.364z" />
  </svg>
);

export const AccuracyIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 15.5l-3.5-3.5a5 5 0 10-7.07-7.07 5 5 0 007.07 7.07z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m-6-8H4m12 0h2" />
  </svg>
);

export const SpeedIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const TrophyIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 2a1 1 0 011 1v1a1 1 0 001 1h1a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 00-1 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1a1 1 0 00-1-1H6a1 1 0 01-1-1V5a1 1 0 011-1h1a1 1 0 001-1V3a1 1 0 011-1h2zM9 13v1a1 1 0 001 1h4a1 1 0 001-1v-1m-6 0h6" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 1.414-1.414M18 5l2.293-2.293a1 1 0 011.414 0L24 5m-4 12l2.293 2.293a1 1 0 010 1.414L19 24l-4-4 1.414-1.414" />
    </svg>
);
