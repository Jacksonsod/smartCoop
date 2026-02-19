import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-slate-200">
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => {
  return (
    <thead className={`bg-slate-50 ${className}`}>
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return (
    <tbody className={`bg-white divide-y divide-slate-200 ${className}`}>
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  const hoverClass = hover ? 'hover:bg-slate-50' : '';
  
  return (
    <tr className={`${hoverClass} ${className}`}>
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '', 
  align = 'left',
  padding = 'md'
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'px-2 py-1',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  return (
    <td className={`
      whitespace-nowrap text-sm text-slate-900
      ${alignClasses[align]}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </td>
  );
};

interface TableHeadCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const TableHeadCell: React.FC<TableHeadCellProps> = ({ 
  children, 
  className = '', 
  align = 'left',
  padding = 'md'
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'px-2 py-1',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  return (
    <th className={`
      font-medium text-slate-700
      ${alignClasses[align]}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </th>
  );
};

export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHeadCell 
};
