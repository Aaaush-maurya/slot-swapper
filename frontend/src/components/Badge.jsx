import React from 'react';

export default function Badge({ children, color = 'gray', className = '' }) {
  const colorMap = {
    gray: 'bg-gray-100 text-gray-700 ring-gray-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    green: 'bg-green-50 text-green-700 ring-green-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    amber: 'bg-amber-50 text-amber-800 ring-amber-200'
  };

  const classes = [
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
    colorMap[color] || colorMap.gray,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}


