import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { SnackBar } from '~/components/modals/common/Snackbar';

const SnackbarContext = createContext<Snackbar | null>(null);

interface Snackbar {
  open: (type: any, message: any, options: any) => void;
  close: () => void;
  alert: (message: string, options?: any) => void;
  success: (message: string, options?: any) => void;
}

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackPack, setSnackPack] = useState<
    { message: string; key: number }[]
  >([]);
  const [messageInfo, setMessageInfo] = useState<{
    message: string;
    key: number;
  } | null>(null);
  const [show, setShow] = useState(false);
  const [type, setType] = useState('unoblue');
  const [options, setOptions] = useState<any>({});

  const alert = useCallback((msg: any, options?: any) => {
    setType('alert');
    setSnackPack((prev) => [
      ...prev,
      { message: msg, key: new Date().getTime() },
    ]);
    setOptions(options);
  }, []);

  const success = useCallback((msg: any, options?: any) => {
    setType('unoblue');
    setSnackPack((prev) => [
      ...prev,
      { message: msg, key: new Date().getTime() },
    ]);
    setOptions(options);
  }, []);

  const open = useCallback((type: any, msg: any, options: any) => {
    setType(type);
    setSnackPack((prev) => [
      ...prev,
      { message: msg, key: new Date().getTime() },
    ]);
    setOptions(options);
  }, []);

  const close = useCallback(() => {
    setShow(false);
    setMessageInfo(null);
  }, []);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setShow(true);
    } else if (snackPack.length && messageInfo && show) {
      setShow(false);
      setMessageInfo(null);
    }
  }, [snackPack, messageInfo, show]);

  const value = useMemo(
    () => ({
      open,
      close,
      alert,
      success,
    }),
    [alert, close, open, success]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {show && (
        <SnackBar
          color={type}
          show={show}
          message={messageInfo ? messageInfo.message : ''}
          onClosed={close}
          leadingItems={options?.leadingItems}
          actionItems={options?.actionItems}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export function useSnackbarContext() {
  return useContext(SnackbarContext) as Snackbar;
}
