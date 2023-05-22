import { useState } from 'react';
import styled from 'styled-components';
import { ProfileView } from './ProfileView';
import { ProfileDetailTable } from './ProfileDetailTable';
import { ArrowUpFillIcon } from '~/icons/ArrowUpFill';
import { ArrowDownFillIcon } from '~/icons/ArrowDownFill';

const IdCard = styled.div`
  padding: 0 !important;
  margin: 0 10px;
  border: 1px solid #d7e3f1;
  border-radius: 4px;
  font-size: 12px;
`;

const CollapseExpandButton = styled.div`
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: #9cb2cd;
  }
  svg {
    height: 18px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  color: #9cb2cd;
  cursor: pointer;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 100%;
`;

export const CustomerIdCard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <IdCard>
      <ProfileView />
      <ProfileDetailTable expanded={expanded} />
      <CollapseExpandButton
        onClick={() => {
          setExpanded((value) => !value);
        }}
      >
        {expanded ? (
          <ButtonWrapper>
            접기
            <IconWrapper>
              <ArrowUpFillIcon fontSize="xs" />
            </IconWrapper>
          </ButtonWrapper>
        ) : (
          <ButtonWrapper>
            펼치기
            <IconWrapper>
              <ArrowDownFillIcon fontSize="xs" />
            </IconWrapper>
          </ButtonWrapper>
        )}
      </CollapseExpandButton>
    </IdCard>
  );
};
