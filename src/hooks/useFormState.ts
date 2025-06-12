import { useState, useCallback } from 'react';

interface UseFormState<T> {
  formData: T;
  updateField: (field: keyof T, value: any) => void;
  updateFormData: (data: Partial<T>) => void;
  resetForm: (initialData: T) => void;
}

export const useFormState = <T extends Record<string, any>>(
  initialData: T
): UseFormState<T> => {
  const [formData, setFormData] = useState<T>(initialData);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback((data: T) => {
    setFormData(data);
  }, []);

  return {
    formData,
    updateField,
    updateFormData,
    resetForm
  };
};
