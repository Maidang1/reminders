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
    <div className="apple-form-container">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex-shrink-0"></div>
        <input
          type="text"
          placeholder="输入提醒事项..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加
        </button>
      </div>
    </div>
  );
};
