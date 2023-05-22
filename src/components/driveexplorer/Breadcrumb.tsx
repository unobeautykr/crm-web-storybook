import React, { useCallback } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { color } from '~/themes/styles';
import { useDriveExplorer } from './DriveExplorerProvider';
import { DirectoryData } from '~/api/resources/driveApi';

const BreadcrumbLink = ({
  directory,
  current,
}: {
  directory: DirectoryData;
  current?: boolean;
}) => {
  const { setCurrentDir } = useDriveExplorer();

  const onClick = useCallback(() => {
    setCurrentDir(directory.id);
  }, [directory, setCurrentDir]);

  return (
    <Link
      component="button"
      variant="body2"
      onClick={onClick}
      underline="hover"
      color={color.grey[700]}
      sx={{
        fontSize: 11,
        fontWeight: current ? 700 : undefined,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: 160,
        whiteSpace: 'pre',
      }}
    >
      {directory.parentId ? directory.name : '전체'}
    </Link>
  );
};

const ChevronRightIcon = () => {
  return <ChevronRight sx={{ fontSize: 14 }} />;
};

export const Breadcrumb = () => {
  const { path } = useDriveExplorer();

  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        height: 34,
      }}
    >
      {path.length >= 5 ? (
        <>
          <BreadcrumbLink directory={path[0]} />
          <ChevronRightIcon />
          <Typography
            sx={{
              fontSize: 11,
            }}
          >
            ...
          </Typography>
          <ChevronRightIcon />
          <BreadcrumbLink directory={path[path.length - 2]} />
          <ChevronRightIcon />
          <BreadcrumbLink directory={path[path.length - 1]} current />
        </>
      ) : (
        path.map((d, i) => (
          <React.Fragment key={d.id}>
            <BreadcrumbLink directory={d} current={i === path.length - 1} />
            {i !== path.length - 1 && <ChevronRightIcon />}
          </React.Fragment>
        ))
      )}
    </Box>
  );
};
