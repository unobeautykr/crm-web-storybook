import { Folder } from '@mui/icons-material';
import { useCallback } from 'react';
import { DirectoryData } from '~/api/resources/driveApi';
import { useDriveExplorer } from './DriveExplorerProvider';
import { useDriveItem } from './DriveItemProvider';
import { ItemView } from './ItemView';

export const DirectoryItem = () => {
  const { entity } = useDriveItem();
  const { setCurrentDir } = useDriveExplorer();
  const directory = entity as DirectoryData;

  const onDoubleClick = useCallback(() => {
    setCurrentDir(directory.id);
  }, [directory, setCurrentDir]);

  return (
    <ItemView
      onDoubleClick={onDoubleClick}
      thumbnail={<Folder sx={{ fontSize: 40 }} />}
      name={directory.name}
    />
  );
};
