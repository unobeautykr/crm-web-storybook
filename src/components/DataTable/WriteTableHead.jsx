import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { ThStyle, ThCell } from './DataTableStyleUtil';

const Th = styled('th')(
  ({ required }) => `
  ${ThStyle}
  ${
    required
      ? `
      ${ThCell}::after {
        content: ' *';
        display: contents;
        color: #eb5757;
      }
    `
      : ''
  }
`
);

export const WriteTableHead = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((col, i) => (
          <Th
            key={`th-${col.id}-${i}`}
            grow={col.grow}
            styleType="chart"
            required={col.required}
          >
            <ThCell>{col.name}</ThCell>
          </Th>
        ))}
      </tr>
    </thead>
  );
};

WriteTableHead.propTypes = {
  columns: PropTypes.array,
};
