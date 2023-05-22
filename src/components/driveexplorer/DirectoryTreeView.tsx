import { TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useCallback, useState } from 'react';
import { DirectoryTreeItem } from './DirectoryTreeItem';
import { useDriveExplorer } from './DriveExplorerProvider';

interface DirectoryTreeViewProps {
  onDrop?: (
    fileIds: number[],
    directoryIds: number[],
    targetDirectoryId: number
  ) => void;
  onSelect?: (id: number) => void;
}

export const DirectoryTreeView: React.VFC<DirectoryTreeViewProps> = ({
  onDrop,
  onSelect,
}) => {
  const { root, currentDir: currentDirectoryId } = useDriveExplorer();

  const [expanded, setExpanded] = useState<string[]>([root.id.toString()]);

  const handleToggle = useCallback(
    (event: React.SyntheticEvent, nodeIds: string[]) => {
      setExpanded(nodeIds);
    },
    []
  );

  const handleSelect = useCallback(
    (_event: React.SyntheticEvent, nodeId: string) => {
      onSelect?.(Number(nodeId));
    },
    [onSelect]
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      selected={currentDirectoryId?.toString() ?? ''}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      <DirectoryTreeItem node={root} onDrop={onDrop} />
    </TreeView>
  );
};
