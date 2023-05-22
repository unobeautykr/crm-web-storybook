import styled from 'styled-components';
import { ReactComponent as IdCardIcon } from '~/assets/images/icon/ic-id-card.svg';
import { ReactComponent as MemoIcon } from '~/assets/images/icon/ic-memo.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  width: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 6px;
  color: #a1b1ca;
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
  margin: 5px 0;
  width: 24px;
`;

export const CollapsedSideBar = () => {
  return (
    <Wrapper>
      <ButtonWrapper>
        <IdCardIcon />
        <span>고객정보</span>
      </ButtonWrapper>

      <ButtonWrapper>
        <MemoIcon />
        <span>차팅이력</span>
      </ButtonWrapper>
    </Wrapper>
  );
};
