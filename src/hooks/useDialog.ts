import { useCallback, useMemo, useState } from "react";

export const useDialog = <T>() => {
  const [opened, setOpened] = useState(false);
  const [data, setData] = useState<T>({} as T);
  const [disabled, setDisabled] = useState(false);

  const close = useCallback(() => {
    setOpened(false);
  }, []);

  const open = useCallback((data?: T) => {
    setOpened(true);
    setData(data as T);
  }, []);

  const toggle = useCallback(() => {
    setOpened((v) => !v);
  }, []);

  return useMemo(
    () => ({
      opened,
      close,
      open,
      toggle,
      disabled,
      setDisabled,
      data,
      ...data,
    }),
    [close, data, disabled, open, opened, toggle]
  );
};
