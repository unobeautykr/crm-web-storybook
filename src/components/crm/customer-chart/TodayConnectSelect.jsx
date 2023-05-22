import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { Select } from '~/components/Select';
import DateSelect from '~/components/DateSelect';
import update from 'immutability-helper';

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const ColorChip = styled.div`
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Label = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const OptionLabel = ({ color = '#2c62f6', children }) => (
  <OptionWrapper>
    <ColorChip style={{ background: color }} />
    <Label>{children}</Label>
  </OptionWrapper>
);

OptionLabel.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};

const TodayConnectSelect = () => {
  const {
    customerId,
    formData,
    setFormData,
    connectRegistration,
    setConnectRegistration,
  } = useContext(CustomerChartContext);
  const [historyOption, setHistoryOption] = useState();
  const { data: registrationData = [], loading } = useFetch(
    buildUrl(`/registrations`, {
      customerId: customerId,
      limit: 100,
      orderBy: 'startAt asc, createdAt desc',
      dateStart: moment(formData?.date).format('YYYY-MM-DD'),
      dateEnd: moment(formData?.date).format('YYYY-MM-DD'),
      statuses:
        'NONE,SCHEDULED,NO_SHOW,CANCELED,REGISTERED,CONSULTING_WAITING,CONSULTING_DURING,CONSULTING_DONE,TREATMENT_WAITING,TREATMENT_DURING,TREATMENT_DONE,SURGERY_WAITING,SURGERY_DURING,SURGERY_DONE,PAYMENT_WAITING,LEAVE',
    }),
    {
      onNewData: (old, updates) => {
        // 새로운 폼을 작성하는 상황 (연결된 접수가 없는 경우) 첫번째 옵션을 기본으로 선택
        if (!formData?.id && !formData?.registration?.id) {
          setConnectRegistration(updates.data[0]);
        } else {
          let match = updates.data.find(
            (o) => o?.id == formData?.registration?.id
          );
          if (match) {
            setConnectRegistration(match);
          } else {
            // 매칭되는 옵션이 없을 경우(접수취소, 접수없음으로 연결된 데이터), invalid key를 추가함
            setHistoryOption({ invalid: true, ...formData?.registration });
            setConnectRegistration({
              invalid: true,
              ...formData?.registration,
            });
          }
        }
        return updates.data.map((v) => ({
          ...v,
          label: (
            <OptionLabel>
              {v.date} {v.startHour} / {v.department.category?.name} -{' '}
              {v.department?.name}
            </OptionLabel>
          ),
        }));
      },
    },
    [formData]
  );

  return (
    <>
      <DateSelect
        style={{ width: '120px' }}
        value={formData?.date ?? new Date()}
        onChange={(v) => {
          setFormData(
            update(formData, {
              date: { $set: v },
            })
          );
        }}
      />
      <Select
        style={{ width: '50%' }}
        value={connectRegistration?.id ?? historyOption?.id ?? ''}
        onChange={(v) => {
          setConnectRegistration(
            registrationData.find((o) => o?.id == v) ?? historyOption ?? null
          );
        }}
        placeholder={loading ? 'loading...' : ''}
        options={[
          ...registrationData,
          {
            id: historyOption?.id ?? null,
            label: <OptionLabel color="#AAA">접수 없음</OptionLabel>,
          },
        ]}
        optionLabel="label"
      />
    </>
  );
};

TodayConnectSelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default TodayConnectSelect;
