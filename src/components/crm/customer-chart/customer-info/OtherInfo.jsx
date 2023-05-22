import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TabCategory from './TabCategory';
import DetailInfo from './DetailInfo';
import FamilyInfo from './FamilyInfo';
import VitalInfo from './VitalInfo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;

const OtherInfo = () => {
  const [selectedTab, setSelectedTab] = useState('detail');

  return (
    <Wrapper>
      <TabCategory selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === 'detail' && <DetailInfo />}
      {selectedTab === 'family' && <FamilyInfo />}
      {selectedTab === 'vital' && <VitalInfo />}
    </Wrapper>
  );
};

OtherInfo.propTypes = {
  obj: PropTypes.object,
  setObj: PropTypes.func,
  onChangeValue: PropTypes.func,
};

export default OtherInfo;
