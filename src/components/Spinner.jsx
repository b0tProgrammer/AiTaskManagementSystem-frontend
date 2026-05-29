import React from 'react';

const Spinner = ({ size = 6, className = '', label }) => {
  const sz = typeof size === 'number' ? `${size}rem` : size;
  return (
    <div className={`flex items-center gap-3 ${className}`} role="status">
      <svg
        className="animate-spin text-gray-500"
        style={{ width: sz, height: sz }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
};

export default Spinner;
