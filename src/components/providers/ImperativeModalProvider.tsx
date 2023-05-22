import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface Modal {
  open: <T>(
    modalFactory: (close: (resolveValue?: T) => void) => ReactElement
  ) => Promise<T | void>;
}

const ImperativeModalContext = createContext<Modal | null>(null);

export const ImperativeModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [modal, setModal] = useState<ReactElement | null>(null);

  const open: Modal['open'] = useCallback((modalFactory) => {
    return new Promise((resolve) => {
      setModal(
        modalFactory((resolveValue) => {
          setModal(null);
          resolve(resolveValue);
        })
      );

      return;
    });
  }, []);

  return (
    <ImperativeModalContext.Provider value={{ open }}>
      {children}
      {modal}
    </ImperativeModalContext.Provider>
  );
};

export const useImperativeModal = () => {
  return useContext(ImperativeModalContext) as Modal;
};
