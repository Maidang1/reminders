import React from 'react';

interface QuickAddFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const QuickAddForm: React.FC<QuickAddFormProps> = ({
  value,
  onChange,
  onSubmit
}) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 apple-form-container">
        <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex-shrink-0"></div>
        <input
          type="text"
          placeholder="Notes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
        />
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Add Tags</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-3">
        <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-md text-sm text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Today
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Add Time
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Add Location
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
          <span>#</span>
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
