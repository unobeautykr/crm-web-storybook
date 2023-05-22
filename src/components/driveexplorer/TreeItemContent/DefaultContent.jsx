import { useTreeItem } from '@mui/lab';
import clsx from 'clsx';
import { forwardRef, useMemo } from 'react';
import { Typography } from '@mui/material';
import { FolderOpenIcon } from '~/icons/FolderOpen';
import { Folder } from '@mui/icons-material';
import { Box } from '@mui/system';
import { color } from '~/themes/styles';
import { useDriveExplorer } from '../DriveExplorerProvider';

export const DefaultContent = forwardRef(function CustomContent(
  { highlighted, ...props },
  ref
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const { directories } = useDriveExplorer();

  const directory = directories.find((d) => d.id === Number(nodeId));

  const depth = useMemo(() => {
    let dir = directory;
    let depth = 0;
    while (dir) {
      const nextDir = dir;
      dir = directories.find((d) => d.id === nextDir.parentId);
      if (dir) {
        depth++;
      }
    }

    return depth;
  }, [directories, directory]);

  const { expanded, selected, handleExpansion, handleSelection } =
    useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    handleSelection(event);
    if (depth !== 0 && (selected || !expanded)) {
      handleExpansion(event);
    }
  };

  return (
    <Box
      className={clsx(className, classes.root)}
      sx={{
        alignItems: 'center',
        gap: 1,
        minWidth: 'fit-content',
        ...((selected || highlighted) && {
          backgroundColor: color.bluegrey[500],
        }),
        [`&.${classes.root}`]: {
          padding: 1,
          pl: 1 + Math.max(depth - 1, 0) * 3,
        },
      }}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {directory?.parentId && (
        <div className={classes.iconContainer}>{icon}</div>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: color.bluegrey[600],
          ...(selected && {
            color: color.primary.unoblue,
          }),
        }}
      >
        {directory?.parentId ? (
          <Folder sx={{ fontSize: 16 }} />
        ) : (
          <FolderOpenIcon fontSize="small" />
        )}
      </Box>
      <Typography
        component="div"
        sx={{
          fontSize: 12,
          maxWidth: 116,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          ...(selected && {
            fontWeight: 700,
          }),
        }}
      >
        {label}
      </Typography>
    </Box>
  );
});
