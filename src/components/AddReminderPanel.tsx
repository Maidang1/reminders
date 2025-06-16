import React from 'react';
import { CreateReminderData } from '../types';
import { COLOR_OPTIONS } from '../constants/options';
import { useFormState } from '../hooks/useFormState';
import { FormField } from './shared/FormField';
import { ColorPicker } from './shared/ColorPicker';

interface AddReminderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReminder: (data: CreateReminderData) => void;
}

export const AddReminderPanel: React.FC<AddReminderPanelProps> = ({
  isOpen,
  onClose,
  onCreateReminder,
}) => {
  const { formData, updateFormData, resetForm } = useFormState({
    title: '',
    color: COLOR_OPTIONS[0] as string,
    group_id: 'default', // 由于去掉了分组，使用默认值
    cron_expression: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onCreateReminder({
        title: formData.title.trim(),
        color: formData.color,
        group_id: 'default',
        cron_expression: formData.cron_expression || undefined,
        description: formData.description || undefined,
      });
      resetForm({
        title: '',
        color: COLOR_OPTIONS[0] as string,
        group_id: 'default',
        cron_expression: '',
        description: '',
      });
      onClose();
    }
  };

  const handleCancel = () => {
    resetForm({
      title: '',
      color: COLOR_OPTIONS[0] as string,
      group_id: 'default',
      cron_expression: '',
      description: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* 面板 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        <div className="apple-form-container w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">添加提醒</h2>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-full bg-gray-600 bg-opacity-30 hover:bg-opacity-50 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="标题" required>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="输入提醒标题..."
                className="apple-input"
                autoFocus
              />
            </FormField>

            <FormField label="描述">
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="添加描述..."
                rows={3}
                className="apple-input resize-none"
              />
            </FormField>

            <FormField label="颜色">
              <ColorPicker
                selectedColor={formData.color}
                onColorChange={(color) => updateFormData({ color })}
                colors={COLOR_OPTIONS}
              />
            </FormField>

            <FormField label="定时规则">
              <input
                type="text"
                value={formData.cron_expression}
                onChange={(e) => updateFormData({ cron_expression: e.target.value })}
                placeholder="例如: 0 9 * * * (每天9点)"
                className="apple-input"
              />
              <div className="mt-2 text-xs text-gray-400">
                使用 Cron 表达式设置重复提醒，留空则为一次性提醒
              </div>
            </FormField>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 apple-button apple-button-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="flex-1 apple-button apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
