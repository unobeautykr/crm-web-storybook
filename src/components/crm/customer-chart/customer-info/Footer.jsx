import { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '~/components/Button';
import { CustomerInfoContext } from './CustomerAddChartInfo';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;

  button {
    width: 32%;
    height: 40px;
    font-size: 12px !important;
  }
`;

export const Footer = () => {
  const {
    type,
    setType,
    loadingBtnDisabledFlag,
    setLoadingBtnDisabledFlag,
    onCustomerCheck,
    setDisableForm,
  } = useContext(CustomerInfoContext);
  return (
    <Wrapper>
      {type === 'create' && (
        <>
          <Button
            styled="outline"
            disabled={loadingBtnDisabledFlag}
            onClick={() => {
              setLoadingBtnDisabledFlag(true);
              onCustomerCheck('appointment');
            }}
          >
            등록 후 예약
          </Button>
          <Button
            styled="outline"
            disabled={loadingBtnDisabledFlag}
            onClick={() => {
              setLoadingBtnDisabledFlag(true);
              onCustomerCheck('workIn');
            }}
          >
            등록 후 접수
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setLoadingBtnDisabledFlag(true);
              onCustomerCheck();
            }}
            disabled={loadingBtnDisabledFlag}
          >
            등록완료
          </Button>
        </>
      )}
      {type === 'edit' && (
        <Button
          type="primary"
          style={{
            width: '100%',
          }}
          onClick={() => {
            setLoadingBtnDisabledFlag(true);
            onCustomerCheck();
          }}
          disabled={loadingBtnDisabledFlag}
        >
          수정완료
        </Button>
      )}
      {type === 'view' && (
        <Button
          type="primary"
          style={{
            width: '100%',
          }}
          onClick={() => {
            setType('edit');
            setDisableForm(false);
          }}
          disabled={loadingBtnDisabledFlag}
        >
          수정
        </Button>
      )}
    </Wrapper>
  );
};
