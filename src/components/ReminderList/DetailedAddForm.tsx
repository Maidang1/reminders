import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReminderGroup } from '../../types';
import { ColorPicker } from '../shared/ColorPicker';
import { FormField } from '../shared/FormField';

interface DetailedAddFormProps {
  isVisible: boolean;
  formData: {
    title: string;
    color: string;
    group_id: string;
    repeat_interval: number;
    repeat_duration: number;
  };
  groups: ReminderGroup[];
  colorOptions: readonly string[];
  intervalOptions: ReadonlyArray<{ value: number; label: string }>;
  onFormDataChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const DetailedAddForm: React.FC<DetailedAddFormProps> = ({
  isVisible,
  formData,
  groups,
  colorOptions,
  intervalOptions,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 apple-form-container"
        >
          <input
            type="text"
            placeholder="提醒标题"
            value={formData.title}
            onChange={(e) => onFormDataChange({...formData, title: e.target.value})}
            className="apple-input mb-4"
          />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="分组">
              <select
                value={formData.group_id}
                onChange={(e) => onFormDataChange({...formData, group_id: e.target.value})}
                className="apple-input"
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="重复间隔">
              <select
                value={formData.repeat_interval}
                onChange={(e) => onFormDataChange({...formData, repeat_interval: parseInt(e.target.value)})}
                className="apple-input"
              >
                {intervalOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </FormField>
          </div>
          
          <FormField label="颜色" className="mb-4">
            <ColorPicker
              colors={colorOptions}
              selectedColor={formData.color}
              onColorSelect={(color) => onFormDataChange({...formData, color})}
            />
          </FormField>
          
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              className="apple-button apple-button-primary flex-1"
            >
              创建提醒
            </button>
            <button
              onClick={onCancel}
              className="apple-button apple-button-secondary flex-1"
            >
              取消
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
