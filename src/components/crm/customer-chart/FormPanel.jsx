import styled from 'styled-components';
import PropTypes from 'prop-types';
import FormChart from './formchart/FormChart';
import { forwardRef, useContext } from 'react';
import { Box } from '@mui/material';
import { CustomerChartContext } from './CustomerChart';

const resizer = (e, elementRef, dialogRef) => {
  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);

  const rect = elementRef.current.getBoundingClientRect();
  let startingX = e.screenX;
  const initialWidth = rect.width;

  function mousemove(e) {
    const offset = startingX - e.screenX;
    elementRef.current.style.width = `${Math.max(
      Math.min(800, initialWidth + offset),
      520
    )}px`;

    dialogRef.current?.update();
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
  }
};

const ResizeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 10px;
  height: 100%;
  top: 0;
  left: 0;
  cursor: col-resize;
  background-color: #d9e3f0;
  &::after {
    content: '';
    display: inline-block;
    width: 2px;
    height: 24px;
    background: #a1b1ca;
    border-radius: 30px;
  }
`;

export const FormPanel = forwardRef(({ formData }, ref) => {
  const { subDialogRef } = useContext(CustomerChartContext);

  return (
    <>
      {formData && (
        <Box
          ref={ref}
          sx={{
            position: 'relative',
            display: 'flex',
            flex: '0 0 auto',
            width: 'min-content',
            minWidth: 520,
            maxWidth: 800,
            background: '#fff',
          }}
        >
          <ResizeButton onMouseDown={(e) => resizer(e, ref, subDialogRef)} />
          <FormChart />
        </Box>
      )}
    </>
  );
});

FormPanel.propTypes = {
  formData: PropTypes.object,
};
