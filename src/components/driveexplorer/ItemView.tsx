import { Box, styled, Typography } from '@mui/material';
import { ReactNode, useCallback, useState } from 'react';
import { color } from '~/themes/styles';
import { Checkbox } from '../Checkbox/Checkbox';
import { Tooltip } from '../Tooltip';
import { useDriveItem } from './DriveItemProvider';

const Wrapper = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
});

const ThumbnailWrapper = styled('div')(
  ({ selected }: { selected: boolean }) => ({
    width: 100,
    height: 72,
    border: `1px solid ${color.line}`,
    borderRadius: 4,
    color: color.bluegrey[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(selected && {
      outline: `2px solid ${color.primary.unoblue}`,
    }),
  })
);

const Name = styled(Typography)(({ selected }: { selected: boolean }) => ({
  fontSize: 12,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  textAlign: 'center',
  overflow: 'hidden',
  padding: '2px 8px',
  borderRadius: 4,
  ...(selected && {
    background: color.primary.unoblue,
    color: 'white',
  }),
}));

export const ItemView = ({
  thumbnail,
  name,
  onDoubleClick,
}: {
  thumbnail: ReactNode;
  name: string;
  onDoubleClick?: () => void;
}) => {
  const { select, deselect, selected, selectable, multiSelect } =
    useDriveItem();

  const [hover, setHover] = useState(false);

  const onClick = useCallback(() => {
    if (!selectable) return;

    if (multiSelect) {
      if (selected) {
        deselect();
      } else {
        select(multiSelect);
      }
    } else {
      select(multiSelect);
    }
  }, [deselect, multiSelect, select, selectable, selected]);

  const onMouseEnter = useCallback(() => {
    setHover(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const showCheckbox = selectable && (hover || selected || multiSelect);

  const onChangeChecked = useCallback(
    (e: any) => {
      if (e.target.checked) {
        select(true);
      } else {
        deselect();
      }
    },
    [deselect, select]
  );

  return (
    <Tooltip
      sx={{
        maxWidth: 446,
      }}
      title={name}
      placement="bottom"
      enterDelay={500}
    >
      <Wrapper
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
      >
        <ThumbnailWrapper selected={selected}>{thumbnail}</ThumbnailWrapper>
        <Name selected={selected}>{name}</Name>
        {showCheckbox && (
          <Box sx={{ position: 'absolute', top: 6, left: 6 }}>
            <Checkbox checked={selected} onChange={onChangeChecked} />
          </Box>
        )}
      </Wrapper>
    </Tooltip>
  );
};
