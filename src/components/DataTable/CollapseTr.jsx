import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Collapse } from '@mui/material';

const Tr = styled('tr')`
  background: #f9fbff;
`;

const Td = styled('td')`
  &&& {
    border: 0;
    padding: 0;
  }
`;

const ColumnValue = styled('span')`
  display: block;
  vertical-align: middle;
  text-align: inherit;
  min-height: 12px;
`;

const DataCell = ({ item, column }) => {
  if (column.value) {
    return <ColumnValue>{column.value(item)}</ColumnValue>;
  }

  if (column.component) {
    return <column.component item={item} />;
  }

  throw new Error('invalid column schema');
};

DataCell.propTypes = {
  item: PropTypes.object,
  column: PropTypes.object,
};

export const CollapseTr = ({ collapsed, schema, item, onMouseOver }) => {
  return (
    <Tr>
      {schema.map((v, i) => (
        <Td key={i} colSpan={v.colSpan} onMouseOver={onMouseOver}>
          <Collapse in={!collapsed} timeout="auto" unmountOnExit>
            <DataCell item={item} column={v} />
          </Collapse>
        </Td>
      ))}
    </Tr>
  );
};

CollapseTr.propTypes = {
  collapsed: PropTypes.bool,
  schema: PropTypes.array,
  item: PropTypes.object,
  onMouseOver: PropTypes.func,
};
