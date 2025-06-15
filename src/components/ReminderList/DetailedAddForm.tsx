import React from 'react';
import { ReminderGroup } from '../../types';
import { ColorPicker } from '../shared/ColorPicker';
import { FormField } from '../shared/FormField';
import { COMMON_CRON_EXPRESSIONS } from '../../constants/options';

interface DetailedAddFormProps {
  isVisible: boolean;
  formData: {
    title: string;
    color: string;
    group_id: string;
    cron_expression?: string;
    description?: string;
  };
  groups: ReminderGroup[];
  colorOptions: readonly string[];
  onFormDataChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const DetailedAddForm: React.FC<DetailedAddFormProps> = ({
  isVisible,
  formData,
  groups,
  colorOptions,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="mt-6 apple-form-container">
      <input
        type="text"
        placeholder="提醒标题"
        value={formData.title}
        onChange={(e) => onFormDataChange({...formData, title: e.target.value})}
        className="apple-input mb-4"
      />
      
      <textarea
        placeholder="描述 (可选)"
        value={formData.description || ''}
        onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
        className="apple-input mb-4"
        rows={3}
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
        
        <FormField label="重复模式">
          <select
            value={formData.cron_expression || ''}
            onChange={(e) => onFormDataChange({...formData, cron_expression: e.target.value})}
            className="apple-input"
          >
            <option value="">无重复</option>
            {COMMON_CRON_EXPRESSIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>
      </div>
      
      <FormField label="自定义 Cron 表达式" className="mb-4">
        <input
          type="text"
          placeholder="如: 0 9 * * 1-5 (工作日9点)"
          value={formData.cron_expression || ''}
          onChange={(e) => onFormDataChange({...formData, cron_expression: e.target.value})}
          className="apple-input"
        />
      </FormField>
      
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
    </div>
  );
};
