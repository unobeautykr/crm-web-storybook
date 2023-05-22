import { useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { color } from '~/themes/styles';
import { useDriveContents } from './DriveContentsProvider';
import { DriveEntityItem } from './DriveEntityItem';
import { Breadcrumb } from './Breadcrumb';
import { Sorter } from './Sorter';

const filesPerRow = 5;

export const DirectoryView = () => {
  const {
    selected,
    entities,
    selectAll,
    deselectAll,
    isSelectedAll,
    multiSelect,
    sorts,
    setSorts,
  } = useDriveContents();

  const onClickSelectAll = useCallback(() => {
    if (isSelectedAll) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [deselectAll, isSelectedAll, selectAll]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ borderBottom: `1px solid ${color.line}` }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: '5px',
          }}
        >
          <Breadcrumb />
          <Sorter sorts={sorts} setSorts={setSorts} />
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: color.line,
              color: color.grey[700],
              fontSize: 11,
              padding: '4px 12px',
              '&:hover': {
                borderColor: color.line,
                color: color.grey[700],
              },
            }}
            onClick={onClickSelectAll}
          >
            {isSelectedAll ? '선택해제' : '전체선택'}
          </Button>
          {multiSelect && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                color={color.primary.unoblue}
                fontSize={12}
                fontWeight={700}
              >
                {selected.length}
              </Typography>
              <Typography fontSize={12} fontWeight={700}>
                개 선택
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 1,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${filesPerRow}, minmax(0, 1fr))`,
              gap: '30px',
            }}
          >
            {entities.map((entity) => (
              <DriveEntityItem key={entity.id} entityId={entity.id} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
