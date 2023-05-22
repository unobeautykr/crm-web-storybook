import { TreeItemContentProps } from '@mui/lab';
import { forwardRef, useCallback } from 'react';
import { useDriveExplorer } from '../DriveExplorerProvider';
import { usePenchartDrop } from '~/hooks/usePenchartDrop';
import { DefaultContent } from './DefaultContent';

export const DroppableContent = forwardRef(function DroppableContent(
  { onDropEntity, ...props },
  ref
) {
  const { nodeId } = props;

  const { directories } = useDriveExplorer();

  const directory = directories.find((d) => d.id === Number(nodeId));

  const onDrop = useCallback(
    (files, directories) => onDropEntity?.(files, directories, directory.id),
    [directory.id, onDropEntity]
  );

  const { isOver, drop } = usePenchartDrop(directory.id, {
    onDrop,
  });

  return (
    <DefaultContent
      ref={(el) => {
        drop(el);
        ref.current = el;
      }}
      highlighted={isOver}
      dropRef={drop}
      {...props}
    />
  );
});
