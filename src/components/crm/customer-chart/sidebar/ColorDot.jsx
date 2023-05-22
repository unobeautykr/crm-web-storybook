import { useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { useFetch } from 'use-http';
import { Popover } from '@mui/material';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { DotColors } from '~/core/dotColor';

const ColorDotWrapper = styled.div``;

const ColorDotPicker = styled.div`
  padding: 10px;
  display: flex;
  background-color: white;
`;

const Dot = styled.div`
  cursor: pointer;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin-right: 5px;

  ${({ value }) =>
    css`
      background-color: ${value.code};
      ${value.name === 'white' && 'border: solid 1px #D9E3F0;'}
    `}
`;

export const ColorDot = () => {
  const { customer } = useContext(CustomerChartContext);
  const { put } = useFetch(`/customers/${customer?.id}`);

  const [colorDot, setColorDot] = useState(
    DotColors.find((f) => f.name === (customer?.color || 'white'))
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const onClickColorDot = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onCloseColorDotPicker = () => {
    setAnchorEl(null);
  };

  const onChangeColorDot = (changeColor) => {
    setColorDot(changeColor);
    onCloseColorDotPicker();
    put({ color: changeColor.name });
  };

  return (
    <ColorDotWrapper>
      <Dot
        value={colorDot}
        onClick={(e) => {
          onClickColorDot(e);
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onCloseColorDotPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ColorDotPicker>
          {DotColors.map((color) => (
            <Dot
              key={color.name}
              value={color}
              onClick={() => onChangeColorDot(color)}
            />
          ))}
        </ColorDotPicker>
      </Popover>
    </ColorDotWrapper>
  );
};
