import { Box } from '@mui/material';
import { color } from '~/themes/styles';
import { DirectoryTreeView } from './DirectoryTreeView';
import { DirectoryView } from './DirectoryView';
import { DriveContentsProvider } from './DriveContentsProvider';
import {
  DriveExplorerProvider,
  useDriveExplorer,
} from './DriveExplorerProvider';

const Contents = () => {
  const { setCurrentDir } = useDriveExplorer();
  const onSelect = (directoryId: number) => {
    setCurrentDir(directoryId);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        gap: 1,
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          width: 216,
          border: `1px solid ${color.line}`,
          borderRadius: 1,
        }}
      >
        <DirectoryTreeView onSelect={onSelect} />
      </Box>
      <Box
        sx={{
          height: '100%',
          width: 660,
          border: `1px solid ${color.line}`,
          borderRadius: 1,
        }}
      >
        <DirectoryView />
      </Box>
    </Box>
  );
};

export const DriveExplorer = ({
  driveId,
  selectableTypes,
  selected,
  selectMode,
  onSelect,
}: {
  driveId: number;
  selectableTypes?: string[];
  selected: number[];
  selectMode: string;
  onSelect: (v: number[]) => void;
}) => {
  return (
    <DriveExplorerProvider driveId={driveId}>
      <DriveContentsProvider
        selected={selected}
        onSelectedChange={onSelect}
        selectableTypes={selectableTypes}
        selectMode={selectMode}
        hideBroken={true}
      >
        <Contents />
      </DriveContentsProvider>
    </DriveExplorerProvider>
  );
};
