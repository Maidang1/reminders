import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  className = '',
}) => {
  return (
    <div className={`form-field px-2 ${className}`}>
      <label className={`form-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      <div className='px-2'>{children}</div>
    </div>
  );
};
