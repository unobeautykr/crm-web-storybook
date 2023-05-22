import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DataTableHead } from './DataTableHead';
import { Checkbox } from '../Checkbox/Checkbox';
import { PlaceHolder } from './PlaceHolder';
import {
  TableStyle,
  TbodyStyle,
  TdStyle,
  ColumnValue,
  LoadingIcon,
} from './DataTableStyleUtil';
import { ReactComponent as DragIcon } from '~/assets/images/icon/drag.svg';

const Table = styled('table')(
  ({ $isDragging }) => `
  ${TableStyle}
  border-top: 0;
  ${
    $isDragging
      ? `
      background: #dee2ec;
    `
      : ''
  }
`
);
const Tbody = styled('tbody')(
  ({ $isDragging }) => `
  ${TbodyStyle}
  tr {
    &:nth-child(odd) {
      background: #f9fbff;
    }
    &:nth-child(even) {
      background: #fff;
    }

    ${
      !$isDragging
        ? `
        &:hover {
          background-color: #edeff1;
        }
      `
        : ''
    }
  }
`
);

const Tr = styled('tr')``;

const Td = styled('td')(
  ({ disable, theme }) => `
  ${TdStyle}
  border-left: 0;
  border-top: 0;
  ${
    disable
      ? `
      color: ${theme.palette.bluegrey[600]};
    `
      : ''
  }
`
);

const TdInner = styled('div')`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

const DragButton = styled('span')`
  display: flex;
  align-items: center;
  margin-left: auto;
  flex: 0 0 auto;
  padding: 0;
`;

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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DragTable = ({
  loading,
  placeholder,
  data = [],
  schema,
  checked,
  onChangeChecked,
  onDoubleClickItem,
  dragCallback,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const onCheckAll = (v) => {
    if (v) {
      onChangeChecked(data.map((item) => item.id));
    } else {
      onChangeChecked([]);
    }
  };

  const onCheckItem = (id, v) => {
    if (v) {
      onChangeChecked([id, ...checked]);
    } else {
      onChangeChecked(checked.filter((c) => c !== id));
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const updateList = reorder(data, source.index, destination.index);
    dragCallback(updateList);
    setIsDragging(false);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Table $isDragging={isDragging}>
        <DataTableHead
          styleType="chart"
          checked={
            checked
              ? data.every((item) => checked.includes(item.id))
              : undefined
          }
          onCheckAll={onCheckAll}
          columns={schema.columns}
        />
        <Droppable droppableId="droppable-1">
          {(provider) => (
            <Tbody
              ref={provider.innerRef}
              {...provider.droppableProps}
              $isDragging={isDragging}
            >
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
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={trIndex}
                    >
                      {(provider) => (
                        <Tr
                          key={item.id}
                          {...provider.draggableProps}
                          ref={provider.innerRef}
                          onDoubleClick={() =>
                            onDoubleClickItem && onDoubleClickItem(item)
                          }
                        >
                          {checked && (
                            <Td>
                              <Checkbox
                                checked={checked.includes(item.id)}
                                onChange={(e) =>
                                  onCheckItem(item.id, e.target.checked)
                                }
                              />
                            </Td>
                          )}
                          {schema.columns.map((col, i) => (
                            <Td
                              key={`tr-${col.id}-${i}`}
                              style={{ ...col.style, padding: col.map && 0 }}
                              grow={col.grow}
                              disable={col.disable ? col.disable(item) : false}
                            >
                              <TdInner>
                                <DataCell item={item} column={col} />
                                {col.drag && (
                                  <DragButton {...provider.dragHandleProps}>
                                    <DragIcon />
                                  </DragButton>
                                )}
                              </TdInner>
                            </Td>
                          ))}
                        </Tr>
                      )}
                    </Draggable>
                  ))
                ))}
              {provider.placeholder}
            </Tbody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
};

DragTable.propTypes = {
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  data: PropTypes.array,
  schema: PropTypes.object,
  checked: PropTypes.array,
  onChangeChecked: PropTypes.func,
  onDoubleClickItem: PropTypes.func,
  dragCallback: PropTypes.func,
};
