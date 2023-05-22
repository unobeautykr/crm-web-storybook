import { Dialog, DialogContent } from '@mui/material';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Button } from '~/components/Button';
import { DialogActions } from '~/components/dialog/DialogActions';
import { DialogTitle } from '~/components/dialog/DialogTitle';
import { DriveExplorer } from '~/components/driveexplorer/DriveExplorer';

const Contents = ({ driveId, onClose, onComplete, selectableTypes }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    onClose();
  };

  const onConfirm = async () => {
    setLoading(true);
    try {
      await onComplete(selected);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle onClose={onClose}>펜차트 샘플함</DialogTitle>
      <DialogContent sx={{ height: 640 }}>
        <DriveExplorer
          driveId={driveId}
          selected={selected}
          onSelect={setSelected}
          selectableTypes={selectableTypes}
          selectMode="multiselect"
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          color="mix"
          styled="outline"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button disabled={loading || selected.length === 0} onClick={onConfirm}>
          불러오기
        </Button>
      </DialogActions>
    </>
  );
};

export const LoadPenchartModalContext =
  (createContext < LoadPenchartModal) | (null > null);

export const LoadPenchartModalProvider = ({ children }) => {
  const [data, setData] = (useState < LoadPenchartModalData) | (null > null);

  const onClose = useCallback(() => {
    setData(null);
  }, []);

  const value = useMemo(
    () => ({
      open: setData,
    }),
    []
  );

  return (
    <LoadPenchartModalContext.Provider value={value}>
      {children}
      <Dialog open={Boolean(data)} onClose={onClose} maxWidth="lg">
        {data && (
          <Contents
            driveId={data.driveId}
            onClose={onClose}
            onComplete={data.onComplete}
            selectableTypes={data.selectableTypes}
          />
        )}
      </Dialog>
    </LoadPenchartModalContext.Provider>
  );
};

export const useLoadPenchartModal = () => {
  return useContext(LoadPenchartModalContext);
};
