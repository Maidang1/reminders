import React from 'react';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search",
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`p-4 ${className}`}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="apple-search"
      />
    </div>
  );
};
