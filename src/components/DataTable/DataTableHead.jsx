import { useRef, useMemo, useState } from 'react';
import update from 'immutability-helper';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { Checkbox } from '~/components/Checkbox/Checkbox';
import { IconButton } from '~/components/IconButton';
import { Tooltip } from '~/components/Tooltip';
import { CollapseButton } from './CollapseButton';
import { cellCommonStyle, ThCell } from './DataTableStyleUtil';
import { ReactComponent as SortIcon } from '@ic/ic-sorting-arrow.svg';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ResizeButton = styled('div')(
  ({ theme, active }) => `
  height: 100%;
  display: flex;
  position: absolute;
  cursor: col-resize;
  width: 8px;
  right: -2px;
  top: 0;
  z-index: 1;

  &:hover {
    border-right: 4px solid transparent;
    border-color: ${theme.palette.primary.unoblue};
  }
  ${
    active
      ? `
      border-right: 4px solid transparent;
      border-color: ${theme.palette.primary.unoblue};
    `
      : ''
  }
`
);

const CollapseButtonWrapper = styled('div')`
  display: flex;
  cursor: pointer;
`;

const SortButton = styled(IconButton)(
  ({ direction }) => `
  display: inline-block;
  vertical-align: middle;
  ${
    direction === 'asc'
      ? `
      transform: rotate(180deg);
    `
      : ''
  }
`
);

const SortIconWrapper = styled('div')(
  ({ theme, color }) => `
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    path {
      fill: ${color === 'blue' && theme.palette.primary.unoblue} !important;
    }
  }
`
);

const Th = styled('th')(
  ({ grow, resizable, styleType, style }) => `
  ${cellCommonStyle}
  position: relative;
  font-weight: 700;
  word-break: keep-all;
  ${
    grow
      ? `
          width: auto;
        `
      : `
          ${!resizable ? 'width: 1%' : ''};
          white-space: pre;
          min-width: 25px;
        `
  }
  ${
    styleType === 'chart' || styleType === 'statistics'
      ? `
      line-height: 1.2;
      padding: 6px;
      border: none;
      position: sticky;
      top: 0;
      z-index: 1;
      background: #fff;

      button[name='sort'] {
        margin-left: 8px;
        padding: 0;
      }
    `
      : ''
  };
  ${style ? style : ''}
`
);

const checkDuplicate = (array = []) => {
  var uniqueValues = new Set(array.map((v) => v.id));
  if (uniqueValues.size < array.length) {
    throw new Error('duplicate id in the headers.');
  }
};

const getNestedHeaders = (headers = [], column) => {
  const nested = [
    {
      id: column.id,
      name: column.name,
    },
  ];

  let parent = headers.find((h) => h.id === column.parentHeader);
  while (parent) {
    nested.push(parent);
    parent = headers.find((h) => h.id === parent.parentHeader);
  }

  return nested.reverse();
};

export const DataTableHead = ({
  resizable,
  tbodyRef,
  columnsRef = [],
  setColumnsRef,
  styleType,
  checkedAll,
  checked,
  onCheckAll,
  collapsed,
  onCollapseAll,
  columns,
  headers,
  sorts,
  onChangeSorts,
}) => {
  const theadRef = useRef();
  const [isDropDown, setIsDropDown] = useState(false);

  const nestedHeaders = useMemo(
    () =>
      columns
        .map((col) => ({
          id: col.id,
          headers: getNestedHeaders(headers, col),
        }))
        .reduce((p, c) => {
          p[c.id] = c.headers;
          return p;
        }, {}),
    [columns, headers]
  );

  const maxDepth = useMemo(
    () => Math.max(...columns.map((col) => nestedHeaders[col.id].length)),
    [columns, nestedHeaders]
  );

  const rows = useMemo(
    () =>
      new Array(maxDepth).fill(undefined).map((_, i) =>
        columns.map((col) => {
          const columnHeaders = nestedHeaders[col.id];
          if (columnHeaders.length <= i) return null;

          const isLeaf = i === columnHeaders.length - 1;

          return {
            ...col,
            id: columnHeaders[i].id,
            name: columnHeaders[i].name,
            rowSpan: isLeaf ? maxDepth - i : 1,
            isLeaf,
          };
        })
      ),
    [maxDepth, columns, nestedHeaders]
  );

  // 첫번째 array value와 가까운 중복값 갯수 구하기
  // [1,1,2,2,3,3,1,1,1,1] -> 2
  const calcColspan = (arr) => {
    let num = 1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === arr[i + 1]?.name) {
        num += 1;
      } else {
        break;
      }
    }
    return num;
  };

  checkDuplicate(headers);

  const resizer = (e, ref, col, colIndex) => {
    const ResizeRef = ref.ref;

    if (ResizeRef.current === null) {
      endResizeDragging(col);
      setIsDropDown(false);
      return;
    }

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    let prevX = e.screenX;
    const resizePanel = ResizeRef.current.getBoundingClientRect();

    function mousemove(e) {
      const xDelta = prevX - e.screenX;
      const minWidth =
        ref.headerRef.current.offsetWidth +
        parseInt(
          window.getComputedStyle(ref.headerRef.current.parentElement, null)
            .paddingLeft
        ) +
        parseInt(
          window.getComputedStyle(ref.headerRef.current.parentElement, null)
            .paddingRight
        );

      const updateWidth = Math.min(
        Math.max(minWidth, resizePanel.width - xDelta),
        320
      );

      ref.headerRef.current.parentElement.style.width = `${updateWidth}px`;

      const trList = tbodyRef.current.children;
      for (let i = 0; i < trList.length; i++) {
        let td = trList[i].children[colIndex + 1];
        if (trList[i].children.length < columns.length) {
          let tdIndex = columns
            .filter((f) => f.rowSpan == undefined)
            .findIndex((f) => f.id === col.id);
          td = trList[i].children[tdIndex];
        }
        if (td) {
          const padding = 16;
          td.children[0].style.width = updateWidth - padding + 'px';
          td.children[0].style.overflow = 'hidden';
        }
      }
    }

    function mouseup() {
      endResizeDragging(col);
      setIsDropDown(false);
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
  };

  const startResizeDragging = (col) => {
    let refIndex = columnsRef.findIndex((f) => f.text === col.id);
    if (!columnsRef[refIndex].active) {
      setColumnsRef((col) => {
        return update(col, {
          [refIndex]: { $merge: { active: true } },
        });
      });
    }
  };

  const endResizeDragging = (col) => {
    let refIndex = columnsRef.findIndex((f) => f.text === col.id);
    if (columnsRef[refIndex].active) {
      setColumnsRef((col) => {
        return update(col, {
          [refIndex]: { $merge: { active: false } },
        });
      });
    }
  };

  return (
    <>
      <thead ref={theadRef}>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {rowIndex === 0 && checked !== undefined && (
              <Th styleType={styleType} rowSpan={maxDepth} grow={row.grow}>
                <Checkbox
                  disabled={checkedAll}
                  checked={checked}
                  onChange={(e) => onCheckAll(e.target.checked)}
                />
              </Th>
            )}
            {rowIndex === 0 && collapsed !== undefined && (
              <Th styleType={styleType} rowSpan={maxDepth} grow={row.grow}>
                <CollapseButtonWrapper
                  onClick={() => onCollapseAll(!collapsed)}
                >
                  {collapsed ? '접기' : '펼치기'}
                  <CollapseButton collapsed={!collapsed} />
                </CollapseButtonWrapper>
              </Th>
            )}
            {row.map(
              (col, colIndex) =>
                // 중복값은 그리지 않음
                col &&
                col.id !== row[colIndex - 1]?.id && (
                  <Th
                    key={colIndex}
                    styleType={styleType}
                    colSpan={calcColspan(row.slice(colIndex))}
                    rowSpan={col.rowSpan}
                    grow={col.grow}
                    resizable={resizable}
                    style={col.headerStyle}
                  >
                    <span
                      style={{ display: 'inline-block' }}
                      ref={(el) => {
                        const resizeObj = columnsRef.find(
                          (f) => f.text === col.id
                        );
                        if (resizeObj) {
                          resizeObj.headerRef.current = el;
                        }
                      }}
                    >
                      <ThCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box>{col.name}</Box>
                          {col.tooltip && (
                            <Tooltip title={col.tooltip}>
                              <HelpOutlineIcon sx={{ fontSize: 16 }} />
                            </Tooltip>
                          )}
                          {col.sortable && (
                            <SortIconWrapper
                              color={
                                sorts?.find((f) => f.id === col.id)
                                  ? 'blue'
                                  : 'default'
                              }
                            >
                              <SortIcon
                                onClick={() => {
                                  onChangeSorts(
                                    sorts.find((f) => f.id === col.id)
                                      ? sorts.find((f) => f.id === col.id)
                                      : { id: col.id, value: 'desc' }
                                  );
                                }}
                              />
                            </SortIconWrapper>
                          )}
                        </Box>
                      </ThCell>
                      {resizable && col.isLeaf && (
                        <ResizeButton
                          active={
                            columnsRef.find((f) => f.text === col.id).active
                          }
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            if (!isDropDown) {
                              startResizeDragging(col);
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            if (!isDropDown) {
                              endResizeDragging(col);
                            }
                          }}
                          onMouseDown={(e) => {
                            setIsDropDown(true);
                            e.stopPropagation();
                            startResizeDragging(col);
                            resizer(
                              e,
                              columnsRef.find((f) => f.text === col.id),
                              col,
                              colIndex
                            );
                          }}
                        />
                      )}
                    </span>
                  </Th>
                )
            )}
          </tr>
        ))}
      </thead>
    </>
  );
};

DataTableHead.propTypes = {
  resizable: PropTypes.bool,
  tbodyRef: PropTypes.object,
  columnsRef: PropTypes.array,
  setColumnsRef: PropTypes.func,
  styleType: PropTypes.string,
  checkedColumnName: PropTypes.string,
  checkedAll: PropTypes.bool,
  checked: PropTypes.bool,
  onCheckAll: PropTypes.func,
  collapsed: PropTypes.bool,
  onCollapseAll: PropTypes.func,
  columns: PropTypes.array,
  headers: PropTypes.array,
  sorts: PropTypes.array,
  onChangeSorts: PropTypes.func,
};
