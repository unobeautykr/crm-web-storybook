import { useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Checkbox } from '../Checkbox/Checkbox';
import { DataTableHead } from './DataTableHead';
import { CollapseTr } from './CollapseTr';
import { PlaceHolder } from './PlaceHolder';
import {
  TableStyle,
  TbodyStyle,
  TbodyDefaultStyle,
  TdStyle,
  ColumnValue,
  LoadingIcon,
} from './DataTableStyleUtil';
import { CollapseButton } from './CollapseButton';
import { RowGroup } from './RowGroup';

const ResizeButton = styled('div')(
  ({ active, theme }) => `
    display: flex;
    position: absolute;
    width: 2px;
    right: 0;
    top: 0;
    z-index: 1;
    height: 100%;

    ${
      active
        ? `
        border-right: 1px solid transparent;
        border-color: ${theme.palette.primary.unoblue};
    `
        : ''
    }
`
);

const createHeaders = (headers) => {
  return headers.map((item) => ({
    text: item,
    ref: { current: null },
    headerRef: { current: null },
    active: false,
  }));
};

const Table = styled('table')(
  ({ resizable }) => `
    ${TableStyle}
    ${resizable ? 'width: max-content;' : 'width: 100%;'}
`
);

const Tbody = styled('tbody')(
  ({ styleType }) => `
    ${
      styleType === 'chart' || styleType === 'statistics'
        ? TbodyStyle
        : TbodyDefaultStyle
    }
    tr:last-child {
    border-bottom: 1px solid #dee2ec;
    }
`
);

const Tr = styled('tr')(
  ({ firstTr, bg, highlight, trStyle }) => `
    ${
      firstTr
        ? `
        td:first-of-type {
        border-left: 0;
        }
    `
        : ''
    }
    ${
      bg
        ? `
        background: #f9fbff;
    `
        : ''
    }
    &&& {
    ${
      highlight
        ? `
        background: #f1f1f1;
        `
        : ''
    }
    }
    ${trStyle ? trStyle : ''}
`
);

// https://stackoverflow.com/questions/3542090/how-to-make-div-fill-td-height
const Td = styled('td')`
  ${TdStyle}
  border-bottom: unset;
  height: 1px;
`;

export const DataCell = ({ item, column, index }) => {
  if (column.value) {
    if (Array.isArray(column.value(item))) {
      return <ColumnValue>{column.value(item)[index]}</ColumnValue>;
    }
    return <ColumnValue>{column.value(item, index)}</ColumnValue>;
  }

  if (column.component) {
    return <column.component item={item} />;
  }

  throw new Error('invalid column schema');
};

DataCell.propTypes = {
  item: PropTypes.object,
  column: PropTypes.object,
  index: PropTypes.number,
};

export const DataTable = ({
  resizable = false,
  styleType = 'default',
  colorTheme = 'repeatColor',
  loading,
  placeholder,
  data = [],
  schema,
  sorts,
  onChangeSorts,
  checkedAll,
  checked,
  checkedItems,
  setCheckedItems,
  onChangeChecked,
  collapsed,
  onChangeCollapsed,
  onDoubleClickItem,
  expanded = [],
  HoverButton,
}) => {
  const tbodyRef = useRef([]);
  const [columnsRef, setColumnsRef] = useState(
    resizable ? createHeaders(schema.columns.map((v) => v.id) ?? []) : []
  );

  const [hoverIndex, setHoverIndex] = useState(null);

  const onCheckAll = (v) => {
    if (v) {
      onChangeChecked(data.map((item) => item.id));
      setCheckedItems && setCheckedItems(data);
    } else {
      onChangeChecked([]);
      setCheckedItems && setCheckedItems([]);
    }
  };

  const onCheckItemValue = (value, v) => {
    if (v) {
      setCheckedItems([value, ...checkedItems]);
    } else {
      setCheckedItems(checkedItems.filter((c) => c.id !== value.id));
    }
  };

  const onCheckItem = (id, v) => {
    if (v) {
      onChangeChecked([id, ...checked]);
    } else {
      onChangeChecked(checked.filter((c) => c !== id));
    }
  };

  const onCollapseAll = (v) => {
    if (v) {
      onChangeCollapsed(data.map((item) => item.id));
    } else {
      onChangeCollapsed([]);
    }
  };

  const onCollapseItem = (id) => {
    if (!collapsed.includes(id)) {
      onChangeCollapsed([id, ...collapsed]);
    } else {
      onChangeCollapsed(collapsed.filter((c) => c !== id));
    }
  };

  // [] -> [[]]
  const convertToRowArray = (arr) => {
    if (Array.isArray(schema.columns[0])) return arr;
    else return [arr];
  };
  // if map
  const convertMapArray = (arr, item) => {
    const convertArr = convertToRowArray(arr);
    const matchSchemaIndex = 0;
    const mapCol = convertArr[matchSchemaIndex].filter(
      (v) => v.value && Array.isArray(v.value(item))
    );
    const mapLength = Math.max.apply(
      Math,
      mapCol.map((v) => v.value(item).length)
    );

    // layout check
    if (
      !mapCol
        .map((v) => v.value(item).length)
        .every((val, i, arr) => val === arr[0])
    ) {
      throw new Error('The array length of item should be the same.');
    }

    // set rowspan
    convertArr[matchSchemaIndex].map((v) => {
      if (
        v.rowSpan !== '100%' &&
        (v.component || !Array.isArray(v.value(item)))
      )
        v.rowSpan = (isFinite(mapLength) && mapLength) || 1;
      return v;
    });

    if (!mapCol.length || !mapLength) return convertArr;
    // add columns
    const updateArr = convertArr
      .slice(matchSchemaIndex, 1)
      .concat(Array.apply(null, { length: mapLength - 1 }).map(() => mapCol));

    return convertArr
      .map((v, i) => {
        if (i === matchSchemaIndex) return updateArr;
        return [v];
      })
      .flat();
  };

  const FlatRows = ({ tdColumns, item, trIndex = 0 }) => {
    return tdColumns.map((tdColumn, tdIndex) => (
      <Td
        key={`td-${item.id}-${tdIndex}`}
        style={tdColumn.style}
        grow={tdColumn.grow}
        rowSpan={
          tdColumn.rowSpan === '100%'
            ? convertMapArray(schema.columns, item).length
            : tdColumn?.rowSpan
        }
        colSpan={tdColumn?.colSpan}
      >
        <div
          ref={(el) => {
            const resizeObj = columnsRef.find((f) => f.text === tdColumn.id);
            if (resizeObj) {
              resizeObj.ref.current = el;
            }
          }}
        >
          <DataCell item={item} index={trIndex} column={tdColumn} />
        </div>
      </Td>
    ));
  };

  const GroupRows = ({ data, schema }) => {
    let rows = data;
    const groupKeys = Array.from(
      new Set(rows.map((row) => schema.rowGroup.groupKey(row)))
    );
    const groupData = groupKeys.map((v) => schema.rowGroup.groupData(v));
    return (
      <>
        {groupData.map((v, gi) => {
          const filterRows = rows.filter(
            (row) =>
              schema.rowGroup.groupKey(row) === v[schema.rowGroup.groupId] &&
              expanded.indexOf(schema.rowGroup.groupKey(row)) > -1
          );
          return (
            <>
              <Tr
                key={`tr-${v.id}-${gi}`}
                trStyle={schema?.rows?.style(v)}
                firstTr={true}
              >
                <RowGroup item={v} column={schema.rowGroup} />
              </Tr>
              {filterRows.map((row, trIndex) => {
                return (
                  <Tr
                    key={`tr-${row.id}-${trIndex}`}
                    trStyle={schema?.rows?.style(row)}
                    firstTr={true}
                  >
                    <FlatRows tdColumns={schema.columns} item={row} />
                  </Tr>
                );
              })}
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Table resizable={resizable} onMouseLeave={() => setHoverIndex(null)}>
        <DataTableHead
          resizable={resizable}
          tbodyRef={tbodyRef}
          columnsRef={columnsRef}
          setColumnsRef={setColumnsRef}
          styleType={styleType}
          sorts={sorts}
          onChangeSorts={(sort) => {
            onChangeSorts(sort.id, sort.value === 'desc' ? 'asc' : 'desc');
          }}
          checkedAll={checkedAll}
          checked={
            checkedAll
              ? true
              : checked
              ? data.every((item) => checked.includes(item.id))
              : undefined
          }
          onCheckAll={onCheckAll}
          collapsed={
            collapsed
              ? data.every((item) => collapsed.includes(item.id))
              : undefined
          }
          onCollapseAll={onCollapseAll}
          columns={convertToRowArray(schema.columns)[0]}
          headers={schema.headers}
        />
        <Tbody styleType={styleType} ref={tbodyRef}>
          {loading && (
            <PlaceHolder styleType={styleType} colorTheme="repeatColor">
              <LoadingIcon size={20} />
            </PlaceHolder>
          )}
          {!loading &&
            (!data.length ? (
              <PlaceHolder styleType={styleType} colorTheme="repeatColor">
                {placeholder ?? '등록된 내용이 없습니다.'}
              </PlaceHolder>
            ) : schema.rowGroup ? (
              <GroupRows data={data} schema={schema} />
            ) : (
              data.map((item, i) => (
                <Fragment key={item.id ?? i}>
                  {convertMapArray(schema.columns, item).map(
                    (trColumn, trIndex) => (
                      <Tr
                        key={`tr-${item.id}-${trIndex}`}
                        highlight={
                          hoverIndex === i || checked?.includes(item.id)
                        }
                        onMouseOver={() => setHoverIndex(i)}
                        onDoubleClick={() =>
                          onDoubleClickItem && onDoubleClickItem(item)
                        }
                        firstTr={
                          styleType &&
                          styleType !== 'noneBackground' &&
                          styleType === 'chart' &&
                          trIndex === 0
                        }
                        bg={
                          styleType === 'noneBackground'
                            ? false
                            : (colorTheme === 'repeatColor' ||
                                styleType === 'chart' ||
                                styleType === 'statistics') &&
                              i % 2 === 0
                        }
                        trStyle={schema?.rows?.style(item)}
                      >
                        {trIndex === 0 && checked && (
                          <Td
                            rowSpan={
                              convertMapArray(schema.columns, item).length
                            }
                          >
                            <Checkbox
                              disabled={checkedAll}
                              checked={
                                checkedAll ? true : checked.includes(item.id)
                              }
                              onChange={(e) => {
                                onCheckItem(item.id, e.target.checked);
                                setCheckedItems &&
                                  onCheckItemValue(item, e.target.checked);
                              }}
                            />
                          </Td>
                        )}
                        {trIndex === 0 && collapsed && (
                          <Td
                            rowSpan={
                              convertMapArray(schema.columns, item).length
                            }
                          >
                            <CollapseButton
                              collapsed={!collapsed.includes(item.id)}
                              onClick={() => onCollapseItem(item.id)}
                            />
                          </Td>
                        )}
                        {trColumn.map((tdColumn, tdIndex) => (
                          <Td
                            key={`td-${item.id}-${tdIndex}`}
                            style={tdColumn.style}
                            grow={tdColumn.grow}
                            rowSpan={
                              tdColumn.rowSpan === '100%'
                                ? convertMapArray(schema.columns, item).length
                                : tdColumn?.rowSpan
                            }
                            colSpan={tdColumn?.colSpan}
                          >
                            <Box
                              ref={(el) => {
                                const resizeObj = columnsRef.find(
                                  (f) => f.text === tdColumn.id
                                );
                                if (resizeObj) {
                                  resizeObj.ref.current = el;
                                }
                              }}
                            >
                              <DataCell
                                item={item}
                                index={trIndex}
                                column={tdColumn}
                              />
                            </Box>
                            {resizable && (
                              <ResizeButton
                                active={
                                  columnsRef?.find(
                                    (f) => f.text === tdColumn.id
                                  ).active
                                }
                              />
                            )}
                          </Td>
                        ))}
                        {HoverButton && trIndex === 0 && (
                          <Box
                            component="td"
                            rowSpan={
                              convertMapArray(schema.columns, item).length
                            }
                            sx={{
                              position: 'sticky',
                              zIndex: 1,
                              right: 5,
                              '&&&': {
                                width: 0,
                                minWidth: 0,
                                padding: 0,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                right: 0,
                                top: 4,
                                '&&&': {
                                  border: 0,
                                },
                              }}
                            >
                              <HoverButton
                                show={i === hoverIndex}
                                item={item}
                              />
                            </Box>
                          </Box>
                        )}
                      </Tr>
                    )
                  )}
                  {schema.collapseColumns && (
                    <CollapseTr
                      item={item}
                      schema={schema.collapseColumns}
                      collapsed={!collapsed.includes(item.id)}
                      onMouseOver={() => setHoverIndex(null)}
                    />
                  )}
                </Fragment>
              ))
            ))}
        </Tbody>
      </Table>
    </>
  );
};

DataTable.propTypes = {
  resizable: PropTypes.bool,
  // style
  styleType: PropTypes.oneOf([
    'default',
    'chart',
    'statistics',
    'noneBackground',
  ]),
  colorTheme: PropTypes.oneOf(['clear', 'repeatColor']),

  // data
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  data: PropTypes.array,
  schema: PropTypes.object,
  sorts: PropTypes.array,
  onChangeSorts: PropTypes.func,
  checkedAll: PropTypes.bool,
  checked: PropTypes.array,
  checkedItems: PropTypes.array,
  setCheckedItems: PropTypes.func,
  onChangeChecked: PropTypes.func,
  collapsed: PropTypes.array,
  onChangeCollapsed: PropTypes.func,
  onDoubleClickItem: PropTypes.func,
  expanded: PropTypes.array,
  HoverButton: PropTypes.any,
};
