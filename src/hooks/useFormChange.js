import { useState } from 'react';

export const useFormChange = () => {
  const [formChange, setFormChange] = useState(false);
  const resetFormChange = () => setFormChange(false);
  const checkFormUpdate = (data, original) => {
    if (!data || !original) return;
    setFormChange(JSON.stringify(original) !== JSON.stringify(data));
  };

  return { checkFormUpdate, resetFormChange, formChange };
};
