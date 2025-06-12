import React from 'react';
import { motion } from 'motion/react';

interface AddListButtonProps {
  onClick: () => void;
}

export const AddListButton: React.FC<AddListButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-auto p-4">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="apple-sidebar-item w-full"
      >
        <div className="apple-sidebar-item-content">
          <div className="w-6 h-6 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span>Add List</span>
        </div>
      </motion.button>
    </div>
  );
};
