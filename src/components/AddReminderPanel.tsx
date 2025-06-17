import React, { useEffect } from 'react';
import { CreateReminderData } from '../types';
import { COLOR_OPTIONS } from '../constants/options';
import { useFormState } from '../hooks/useFormState';
import { FormField } from './shared/FormField';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

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

  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isMounted, setIsMounted] = React.useState(false);

  // Handle body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow the DOM to update before showing the panel
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setIsMounted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`modal-backdrop ${isMounted ? 'entered' : 'entering'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`modal-panel h-full max-h-full overflow-hidden ${
          isMobile
            ? `modal-panel-mobile ${isMounted ? 'entered' : 'entering'}`
            : `modal-panel-desktop ${isMounted ? 'entered' : 'entering'}`
        }`}
      >
        <div className='modal-content h-full max-h-full overflow-hidden flex flex-col'>
          {/* Handle bar for mobile */}
          {isMobile && (
            <div className='modal-handle'>
              <div className='modal-handle-bar' />
            </div>
          )}

          <div className='modal-header'>
            <h2 className='modal-title'>添加提醒</h2>
            <button
              onClick={handleCancel}
              className='modal-close-button'
              aria-label='关闭'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className='modal-form'>
            <div className='modal-form-fields custom-scrollbar'>
              <FormField label='标题' required>
                <Input
                  type='text'
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder='输入提醒标题...'
                  autoFocus={!isMobile}
                />
              </FormField>

              <FormField label='描述'>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  placeholder='添加描述...'
                  rows={3}
                />
              </FormField>

              <FormField label='定时规则'>
                <Input
                  type='text'
                  value={formData.cron_expression}
                  onChange={(e) =>
                    updateFormData({ cron_expression: e.target.value })
                  }
                  placeholder='例如: every 15 seconds'
                />
                <div className='form-help'>
                  使用英语表述重复提醒，例如："every 15
                  seconds"，留空则为一次性提醒
                </div>
              </FormField>
            </div>

            <div className='modal-form-actions'>
              <Button
                type='button'
                onClick={handleCancel}
                variant='outline'
                className='flex-1'
              >
                取消
              </Button>
              <Button
                type='submit'
                disabled={!formData.title.trim()}
                className={`flex-1 ${
                  !formData.title.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                添加
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
