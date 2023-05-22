import { useCallback, useState } from 'react';

export const useProgress = (defaultValue = false) => {
  const [progress, setProgress] = useState(defaultValue);

  const withProgress = useCallback(async <T>(func: () => Promise<T>) => {
    try {
      setProgress(true);
      return await func();
    } finally {
      setProgress(false);
    }
  }, []);

  return {
    progress,
    withProgress,
  };
};
