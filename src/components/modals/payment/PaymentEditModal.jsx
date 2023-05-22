import { useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { OverlayWrapper } from './../common/Overlay';
import { ModalWrapper } from './../common/ModalWrapper';
import { ModalHeader } from './../common/ModalHeader';
import { Button } from '~/components/Button';
import { Box } from '@mui/material';
import moment from 'moment';
import { TextField } from '~/components/TextField';
import { payoutMethod } from '~/utils/payoutMethodUtil';
import { DropdownList } from '~/components/DropdownList';
import { payoutCards, payoutBankTransfers } from '~/utils/filters';
import { useApi } from '~/components/providers/ApiProvider';
import { useApiFetch } from '~/hooks/useApiFetch';
import DateInput from '~/components/DateInput';
import update from 'immutability-helper';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { useDataEvent } from '~/hooks/useDataEvent';
import { EventType } from '~/store/dataEvent';

const Hr = styled.hr`
  margin: 15px 0px;
  width: 100%;
  background: #dee2ec;
  border: 0;
  height: 1px;
`;

const cashReceiptOptions = [
  { id: true, label: '발행' },
  { id: false, label: '미발행' },
];

const payoutCardsOptions = [
  ...payoutCards.map((v) => ({ id: v, label: v })),
  {
    id: '직접입력',
    label: '직접입력',
  },
];
const payoutBankTransfersOptions = [
  ...payoutBankTransfers.map((v) => ({
    id: v,
    label: v,
  })),
  {
    id: '직접입력',
    label: '직접입력',
  },
];

const selectOptions = (method) => {
  switch (method) {
    case 'CARD':
      return payoutCardsOptions;
    case 'BANK_TRANSFER':
      return payoutBankTransfersOptions;
    default:
      return [];
  }
};

const PaymentEditModal = ({
  id,
  focusValue,
  paidAt,
  receiver,
  items,
  onClose,
}) => {
  const dataEvent = useDataEvent();
  const sb = useSnackbarContext();
  const datePickerRef = useRef(null);

  const [updateTransactionRequest, setUpdateTransactionRequest] = useState({
    paidAt: new Date(paidAt),
    receiver: receiver,
    items: items,
  });
  const { userApi, paymentApi } = useApi();

  const dutyParams = useMemo(
    () => ({
      userStatus: 'active',
      limit: 300,
    }),
    []
  );

  const { data } = useApiFetch([dutyParams], userApi.duty);

  const dutys = useMemo(() => {
    return data?.data.map((v) => ({ id: v.id, label: v.name })) ?? [];
  }, [data]);

  const checkedChangedItems = useMemo(() => {
    const originalRequest = {
      receivedBy: receiver?.id,
      paidAt: moment(new Date(paidAt)).format('yyyy-MM-dd'),
      items: items.map((v) => ({
        id: v.id,
        cashReceipt: v.cashReceipt,
        companyName: v.companyName,
      })),
    };
    const updateRequest = {
      receivedBy: updateTransactionRequest.receiver?.id,
      paidAt: moment(updateTransactionRequest.paidAt).format('yyyy-MM-dd'),
      items: updateTransactionRequest.items.map((v) => ({
        id: v.id,
        cashReceipt: v.cashReceipt,
        companyName: v.companyName,
      })),
    };

    return JSON.stringify(originalRequest) === JSON.stringify(updateRequest);
  }, [updateTransactionRequest, items, paidAt, receiver]);

  const onClickSave = async () => {
    const payload = {
      receivedBy: updateTransactionRequest.receiver?.id,
      paidAt: moment(updateTransactionRequest.paidAt).format('yyyy-MM-dd'),
      items: updateTransactionRequest.items.map((v) => ({
        id: v.id,
        cashReceipt: v.cashReceipt,
        companyName: v.companyName,
      })),
    };

    try {
      await paymentApi.updateTransactions(id, payload);
      sb.success('저장되었습니다.');
      dataEvent.emit(EventType.PAYMENT_API);
      onClose();
    } catch (e) {
      sb.alert('실패되었습니다.');
    }
  };

  return (
    <OverlayWrapper onClose={onClose}>
      <ModalWrapper>
        <ModalHeader title="수납내역 수정" onClose={() => onClose()} />
        <Box
          sx={{
            padding: '16px',
            overflow: 'auto',
            height: '380px',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 285px)',
              gridGap: '5px',
              fontSize: '11px',
              marginBottom: '5px',
            }}
          >
            <div>수납일</div>
            <div>수납자</div>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 285px)',
              gridGap: '5px',
              fontSize: '11px',
            }}
          >
            <Box>
              <DateInput
                ref={datePickerRef}
                autoFocus={focusValue === 'paidAt'}
                dateFormat="yyyy-MM-dd"
                value={updateTransactionRequest.paidAt}
                onChange={(v) => {
                  if (v === null) return;
                  const updated = update(updateTransactionRequest, {
                    paidAt: { $set: v },
                  });
                  setUpdateTransactionRequest(updated);
                }}
              />
            </Box>
            <Box>
              <DropdownList
                autoFocus={focusValue === 'receiver'}
                useClearIcon={false}
                placeholder={'수납자'}
                options={dutys}
                value={dutys.find(
                  (f) => f.id === updateTransactionRequest.receiver?.id
                )}
                onChange={(c) => {
                  const updated = update(updateTransactionRequest, {
                    receiver: { $set: c },
                  });
                  setUpdateTransactionRequest(updated);
                }}
              />
            </Box>
          </Box>
          <Hr />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 140px)',
              gridGap: '5px',
              fontSize: '11px',
              marginBottom: '5px',
            }}
          >
            <Box>결제</Box>
            <Box>금액</Box>
            <Box>카드사/은행명</Box>
            <Box>현금영수증</Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {updateTransactionRequest.items.map((v, i) => {
              let customCompany = v.customCompany ?? false;
              if (
                v.companyName === null ||
                (v.companyName !== '' &&
                  selectOptions(v.method).filter((f) => f.id === v.companyName)
                    .length === 0)
              ) {
                customCompany = true;
              }

              return (
                <Box
                  key={i}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 140px)',
                    gridGap: '5px',
                  }}
                >
                  <Box>
                    <TextField
                      value={payoutMethod.getName(v.method)}
                      disabled={true}
                    />
                  </Box>
                  <Box>
                    <TextField value={v.amount} disabled={true} />
                  </Box>
                  <Box>
                    {v.method === payoutMethod.cash ? (
                      <TextField value={'-'} disabled={true} />
                    ) : customCompany ? (
                      <TextField
                        placeholder="직접입력"
                        value={v?.companyName ?? ''}
                        onChange={(v) => {
                          const updated = update(updateTransactionRequest, {
                            items: {
                              [i]: {
                                $merge: {
                                  companyName: v ?? '',
                                  customCompany: true,
                                },
                              },
                            },
                          });
                          setUpdateTransactionRequest(updated);
                        }}
                        onClear={() => {
                          const updated = update(updateTransactionRequest, {
                            items: {
                              [i]: {
                                $merge: {
                                  companyName: '',
                                  customCompany: false,
                                },
                              },
                            },
                          });
                          setUpdateTransactionRequest(updated);
                        }}
                      />
                    ) : (
                      <DropdownList
                        autoFocus={
                          focusValue.split('-')[0] === 'companyName' &&
                          focusValue.split('-')[1] === String(i)
                        }
                        placeholder={'카드사/은행명'}
                        options={selectOptions(v.method)}
                        value={selectOptions(v.method).find(
                          (f) => f.id === v.companyName
                        )}
                        onChange={(c) => {
                          if (c === null) {
                            const updated = update(updateTransactionRequest, {
                              items: {
                                [i]: {
                                  $merge: { companyName: '' },
                                },
                              },
                            });
                            setUpdateTransactionRequest(updated);
                            return;
                          }
                          const id = c.id === '직접입력' ? '' : c.id;
                          const customCompany =
                            c.id === '직접입력' ? true : false;
                          const updated = update(updateTransactionRequest, {
                            items: {
                              [i]: {
                                $merge: { companyName: id, customCompany },
                              },
                            },
                          });
                          setUpdateTransactionRequest(updated);
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    {v.method === payoutMethod.card ? (
                      <TextField value={'현금영수증'} disabled={true} />
                    ) : (
                      <DropdownList
                        autoFocus={
                          focusValue.split('-')[0] === 'cashReceipt' &&
                          focusValue.split('-')[1] === String(i)
                        }
                        variant={''}
                        useClearIcon={false}
                        options={cashReceiptOptions}
                        value={cashReceiptOptions.find(
                          (f) => f.id === v.cashReceipt
                        )}
                        onChange={(c) => {
                          const updated = update(updateTransactionRequest, {
                            items: { [i]: { $merge: { cashReceipt: c.id } } },
                          });
                          setUpdateTransactionRequest(updated);
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box
          sx={{
            padding: '16px',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Button
              style={{ width: '100%', height: '48px' }}
              onClick={() => onClickSave()}
              size="l"
              disabled={checkedChangedItems}
            >
              저장
            </Button>
          </Box>
        </Box>
      </ModalWrapper>
    </OverlayWrapper>
  );
};
export default PaymentEditModal;
