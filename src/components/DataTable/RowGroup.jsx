import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { TdStyle } from './DataTableStyleUtil';
import { DataCell } from './DataTable';

const Td = styled('td')`
  ${TdStyle}
  border-bottom: unset;
`;

export const RowGroup = ({ item, column }) => {
  return (
    <Td key={`td-${item.id}`} colSpan={'100%'}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <DataCell item={item} column={column} />
      </div>
    </Td>
  );
};

RowGroup.propTypes = {
  item: PropTypes.object,
  column: PropTypes.object,
  // trIndex: PropTypes.number,
};
