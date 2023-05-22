import { useContext, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useFetch } from 'use-http';
import DefaultProfileImage from '~/assets/images/common/img-profile.png';
import { ColorDot } from './ColorDot';
import ModalAddChartInfo from '~/components/modals/ModalAddChartInfo';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { ageText } from '~/utils/filters';
import { NewBadge } from '~/components/common/NewBadge';
import { TitleTextSex } from '~/components/common/TitleTextSex';
import { Box } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.div`
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  gap: 4px;
  align-items: baseline;
`;

const CustomerName = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  width: 144px;
  max-width: 144px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CustomerChartNo = styled.div`
  color: #9cb2cd;
  line-height: 14px;
  max-width: 144px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: break-space;
`;

const ProfileEditButton = styled.div`
  flex: 0 0 auto;
  border: 1px solid #d7e3f1;
  border-radius: 4px;
  height: 20px;
  padding: 0 2px;
  margin-top: 2px;
  cursor: pointer;
`;

export const ProfileView = () => {
  const { customer } = useContext(CustomerChartContext);
  const [showAddChartInfoModal, setShowAddChartInfoModal] = useState(false);

  const customerInfoSummary = () => {
    const sex = (
      <TitleTextSex sex={customer?.sex}>
        {customer?.sex === 'male' ? 'M' : 'F'}
      </TitleTextSex>
    );
    const age = ageText(customer);

    const ssnHeader = customer?.birthday
      ? customer.birthday.slice(2, 4) +
        customer.birthday.slice(5, 7) +
        customer.birthday.slice(-2)
      : '-';

    return (
      <span>
        ({sex}/{age}/{ssnHeader})
      </span>
    );
  };

  const { get: getImage, data: imageUrlResponse } = useFetch('/images');

  const getThumb = (imageId) => {
    if (!imageId) return;
    getImage(`/${imageId}`);
  };

  useEffect(() => {
    if (customer.profileImageId) {
      getThumb(customer.profileImageId);
    }
  }, [customer.profileImageId]);

  const blobUrl = useMemo(() => {
    if (!customer.profileImageId) return null;
    return imageUrlResponse?.data.thumbnailUrl;
  }, [imageUrlResponse, customer.profileImageId]);

  return (
    <Wrapper>
      <ProfileBox>
        <ProfileImage>
          <img src={blobUrl ?? DefaultProfileImage} />
        </ProfileImage>
        <ProfileInfo>
          {customer.visitType === 'NEW' && <NewBadge />}
          <Box>
            <CustomerName>
              <Box sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                <Name>{customer.name}</Name>
                {customerInfoSummary()}
              </Box>
              <ColorDot />
            </CustomerName>
            <CustomerChartNo>{customer.chartNo}</CustomerChartNo>
          </Box>
        </ProfileInfo>
      </ProfileBox>
      <ProfileEditButton onClick={() => setShowAddChartInfoModal(true)}>
        수정
      </ProfileEditButton>
      {showAddChartInfoModal && (
        <ModalAddChartInfo
          options={{
            customer: customer,
            editInfo: 'edit',
            origin: 'detail',
          }}
          onClose={() => setShowAddChartInfoModal(false)}
        />
      )}
    </Wrapper>
  );
};
