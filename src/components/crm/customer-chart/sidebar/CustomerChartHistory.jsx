import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useFetch } from 'use-http';
import update from 'immutability-helper';
import { removeEmpty } from '~/utils/objUtil';

import { ReactComponent as MemoIcon } from '~/assets/images/icon/ic-memo.svg';
import { ChartHistoryItems } from './ChartHistoryItems';
import { ChartHistoryFilters } from './ChartHistoryFilters';
import { useCustomerChart } from '~/hooks/useCustomerChart';
import { buildUrl } from '~/utils/url';
import { useDataEvent } from '~/hooks/useDataEvent';
import { EventType } from '~/store/dataEvent';

const Wrapper = styled.div`
  padding: 0 !important;
  width: 306px;
  font-size: 12px;
  border-top: 3px solid ${({ theme }) => theme.palette.layout.background};
  margin-top: 10px;
  height: 100%;
  overflow: hidden;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  &&& .react-datepicker-wrapper {
    input {
      height: 26px !important;
    }
  }
`;

const Header = styled.div`
  padding: 10px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 29px;
  margin-bottom: 8px;
`;

const TitleText = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 4px;
`;

const UnpaidLabel = styled.span`
  display: inline-block;
  min-width: 48px;
  padding: 4px;
  font-size: 11px;
  line-height: 1;
  text-align: center;
  border-radius: 2px;
  flex: 0 0 auto;
  background: #eb5757;
  color: #fff;
`;

export const CustomerChartHistory = observer(() => {
  const { customerId } = { customerId: '' };
  const chartStore = useCustomerChart();
  const dataEvent = useDataEvent();

  const limit = 20;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    customerId,
    orderBy: 'date desc',
    page,
    limit,
    progresses: 'CLOSED,OPEN',
  });
  const [departmentIds, setDepartmentIds] = useState([]);
  const [allCollapsed, setAllCollapsed] = useState(false);

  const { data: paymentSummary, get: getPaymentSummary } = useFetch(
    buildUrl('/payments/summary', {
      customerId: customerId,
    }),
    []
  );

  useEffect(() => {
    const dispose = dataEvent.on(
      EventType.PAYMENT_SUMMARY_API,
      getPaymentSummary
    );
    return dispose;
  }, [getPaymentSummary, dataEvent]);

  const { get, response } = useFetch();

  const loadApi = async (nextLoad, params) => {
    let urlParams = new URLSearchParams(params);

    const getUrl = '/sessions';
    const getData = await get(urlParams ? `${getUrl}?${urlParams}` : getUrl);
    if (response.ok) {
      if (params.page < Math.ceil(getData?.pagination.total / limit)) {
        setPage(params.page + 1);
        const newParam = update(params, {
          page: { $set: params.page + 1 },
        });
        setParams(newParam);
      }
      if (nextLoad) {
        setData((data) => [...data, ...getData.data]);
      } else {
        setData([...getData.data]);
      }
      setTotal(getData.pagination.total);
      chartStore.setReloadMemoType(false);
    }
  };

  useEffect(() => {
    setParams((parmas) => {
      let update = removeEmpty({
        ...parmas,
        page: 1,
      });
      loadApi(false, update);
      return update;
    });
  }, []);

  useEffect(() => {
    if (chartStore.reloadMemoType) {
      loadApi(
        false,
        update(params, {
          page: { $set: 1 },
        })
      );
    }
  }, [chartStore.reloadMemoType]);

  const onChangeDepartmentIds = (selected) => {
    setDepartmentIds(selected);
    if (selected.length !== 0) {
      setPage(1);
      const newParam = update(params, {
        page: { $set: 1 },
        departmentIds: { $set: selected.map((v) => v) },
      });
      setParams(newParam);
      loadApi(false, newParam);
    } else {
      let newParam = params;
      delete newParam.departmentIds;
      setParams(
        update(newParam, {
          page: { $set: 1 },
        })
      );
      loadApi(
        false,
        update(newParam, {
          page: { $set: 1 },
        })
      );
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>
          <FlexWrapper>
            <MemoIcon />
            <TitleText>차팅이력 ({total ?? 0})</TitleText>
          </FlexWrapper>
          {paymentSummary?.data?.unpaidAmount > 0 && (
            <UnpaidLabel>미수</UnpaidLabel>
          )}
        </Title>
        <FilterWrapper>
          <ChartHistoryFilters
            departmentIds={departmentIds}
            allCollapsed={allCollapsed}
            setDepartmentIds={() => {}}
            setAllCollapsed={() => {}}
            // setAllCollapsed={setAllCollapsed}
            // setDepartmentIds={onChangeDepartmentIds}
          />
        </FilterWrapper>
      </Header>
      <ChartHistoryItems
        allCollapsed={allCollapsed}
        data={data}
        total={total}
        loadApi={() => {}}
        // loadApi={(nextLoad) => {
        //   loadApi(nextLoad, params);
        // }}
      />
    </Wrapper>
  );
});
