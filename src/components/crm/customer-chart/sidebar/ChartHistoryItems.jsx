import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ChartCard } from './ChartCard';
import { HideScrollStyle } from '~/utils/cssUtil';
import { hexToRgbaString } from '~/utils/colorUtil';

const Wrapper = styled.div`
  padding: 0 10px 10px 10px;
  overflow: auto;
  height: calc(100% - 115px);
  ${HideScrollStyle}
`;

const EmptyText = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DescriptionText = styled.div`
  font-family: Noto Sans KR;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  white-space: nowrap;
`;

const MoreButton = styled.div`
  cursor: pointer;
  padding: 10px 0;
  text-align: center;
  background: ${({ theme }) => hexToRgbaString(theme.color.common.bg, 0.2)};
`;

export const ChartHistoryItems = ({ allCollapsed, data, total, loadApi }) => {
  return (
    <Wrapper id="chartItemsDiv">
      {data.length > 0 ? (
        <>
          {data.map((item, i) => (
            <ChartCard key={i} allCollapsed={allCollapsed} item={item} />
          ))}
          {total > data.length && (
            <MoreButton
              onClick={() => {
                if (total > data.length) {
                  loadApi(true);
                }
              }}
            >
              + 더보기
            </MoreButton>
          )}
        </>
      ) : (
        <EmptyText>
          <DescriptionText>{'조회 결과가 없습니다.'}</DescriptionText>
        </EmptyText>
      )}
    </Wrapper>
  );
};

ChartHistoryItems.propTypes = {
  allCollapsed: PropTypes.bool,
  data: PropTypes.array,
  total: PropTypes.number,
  loadApi: PropTypes.func,
};
