import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DepartmentMultiSelect } from './DepartmentMultiSelect';
import { UnderlineButton } from '~/components/UnderlineButton';

const Wrapper = styled.div`
  display: flex;
  grid-column-gap: 8px;
  height: 24px;

  .multi-select {
    width: 100%;
    height: 100%;
    .dropdown-container .dropdown-heading {
      width: 100% !important;
      height: 100% !important;
      padding: 0 4px;
      svg {
        transform: scale(0.6);
        width: 20px;
      }
    }
    .gray {
      color: rgb(45 45 45 / 40%);
      transition: 0;
    }
  }
`;

export const ChartHistoryFilters = ({
  departmentIds,
  setDepartmentIds,
  allCollapsed,
  setAllCollapsed,
}) => {
  return (
    <Wrapper>
      <DepartmentMultiSelect
        value={departmentIds}
        onChange={(selected) => setDepartmentIds(selected)}
      />
      <UnderlineButton
        size="s"
        color="secondary"
        onClick={() => setAllCollapsed((all) => !all)}
      >
        {allCollapsed ? '전체 펼치기' : '전체 접기'}
      </UnderlineButton>
    </Wrapper>
  );
};

ChartHistoryFilters.propTypes = {
  departmentIds: PropTypes.array,
  setDepartmentIds: PropTypes.func,
  allCollapsed: PropTypes.bool,
  setAllCollapsed: PropTypes.func,
};
