import React from 'react';
import { ColorPicker } from '../shared/ColorPicker';

interface CreateGroupFormProps {
  isVisible: boolean;
  groupName: string;
  selectedColor: string;
  colorOptions: ReadonlyArray<string>;
  onGroupNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  isVisible,
  groupName,
  selectedColor,
  colorOptions,
  onGroupNameChange,
  onColorChange,
  onCreate,
  onCancel
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="mx-4 mb-4 apple-form-container">
      <input
        type="text"
        placeholder="List Name"
        value={groupName}
        onChange={(e) => onGroupNameChange(e.target.value)}
        className="apple-input mb-3"
        autoFocus
      />
      
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">Color:</div>
        <ColorPicker
          colors={colorOptions}
          selectedColor={selectedColor}
          onColorSelect={onColorChange}
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onCreate}
          className="apple-button apple-button-primary apple-button-small flex-1"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="apple-button apple-button-secondary apple-button-small flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
