import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { WriteTableHead } from './WriteTableHead';
import { PlaceHolder } from './PlaceHolder';
import {
  TableStyle,
  TbodyStyle,
  TdStyle,
  ColumnValue,
  LoadingIcon,
} from './DataTableStyleUtil';

const Table = styled('table')(
  ({ fixHead }) => `
  ${TableStyle}
  ${
    fixHead
      ? `
      overflow: hidden;
    `
      : ''
  }
`
);
const Tbody = styled('tbody')`
  ${TbodyStyle}
  tr {
    &:nth-child(odd) {
      background: #f9fbff;
    }
    &:hover {
      background-color: #edeff1;
    }
  }
`;

const Tr = styled('tr')(
  ({ fadeIn }) => `
  @keyframes highlight {
    from {
      background-color: rgba(255, 252, 226, 1);
    }
    to {
      background-color: rgba(255, 252, 226, 0);
    }
  }
  td {
    ${
      fadeIn
        ? `
        animation: highlight 2s;
      `
        : ''
    }
  }
`
);

const Td = styled('td')(
  ({ disable, theme }) => `
  ${TdStyle}
  border-left: 0;
  ${
    disable
      ? `
      color: ${theme.palette.bluegrey[600]};
    `
      : ''
  }
`
);

const DataCell = ({ item, column }) => {
  if (column.value) {
    return <ColumnValue style={column.style}>{column.value(item)}</ColumnValue>;
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

export const WriteTable = ({
  loading,
  placeholder,
  data = [],
  schema,
  fixHead,
}) => {
  return (
    <>
      <Table fixHead={fixHead}>
        <WriteTableHead styleType="chart" columns={schema.columns} />
        <Tbody>
          {loading && (
            <PlaceHolder styleType="chart">
              <LoadingIcon size={20} />
            </PlaceHolder>
          )}

          {!loading &&
            (!data.length ? (
              <PlaceHolder styleType="chart">
                {placeholder ?? '등록된 내용이 없습니다.'}
              </PlaceHolder>
            ) : (
              data.map((item, trIndex) => (
                <Tr key={trIndex} fadeIn={item.fadeIn}>
                  {schema.columns.map((col, i) => (
                    <Td
                      key={`tr-${col.id}-${i}`}
                      style={{ ...col.style, padding: col.map && 0 }}
                      grow={col.grow}
                      disable={col.disable ? col.disable(item) : false}
                    >
                      <DataCell item={item} column={col} />
                    </Td>
                  ))}
                </Tr>
              ))
            ))}
        </Tbody>
      </Table>
    </>
  );
};

WriteTable.propTypes = {
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  data: PropTypes.array,
  schema: PropTypes.object,
  onChangeSorts: PropTypes.func,
  fixHead: PropTypes.bool,
};
