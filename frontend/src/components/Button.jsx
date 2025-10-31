import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary: 'bg-gray-900 text-white hover:bg-black focus-visible:ring-gray-900',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-300'
  };

  const sizes = {
    sm: 'text-sm px-2.5 py-1.5',
    md: 'text-sm px-3.5 py-2',
    lg: 'text-base px-4.5 py-2.5'
  };

  const classes = [base, variants[variant] || variants.primary, sizes[size] || sizes.md, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}


