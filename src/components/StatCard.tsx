import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
  className = '',
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100',
      text: 'text-primary-600',
      iconBg: 'bg-primary-600',
      iconText: 'text-white',
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      iconBg: 'bg-green-600',
      iconText: 'text-white',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-600',
      iconText: 'text-white',
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      iconBg: 'bg-red-600',
      iconText: 'text-white',
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      iconBg: 'bg-blue-600',
      iconText: 'text-white',
    },
  };

  const currentColor = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <svg
                className={`h-4 w-4 mr-1 ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {trend.isPositive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                )}
              </svg>
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`
            flex h-12 w-12 items-center justify-center rounded-lg
            ${currentColor.iconBg}
          `}>
            <div className={currentColor.iconText}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
