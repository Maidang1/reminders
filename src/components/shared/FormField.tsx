import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
};
