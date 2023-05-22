import { useContext } from 'react';
import styled from 'styled-components';
import { useFetch } from 'use-http';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { convertFormData } from '~/utils/convertFormData';

import QuillText from '~/components/quill/QuillText';
import { ReactComponent as ArrowRightFill } from '@ic/arrow-right-fill.svg';
import { StatusConfig, ManagerNames } from './ChartCard';

import { useChartCard } from '~/hooks/useChartCard';
import { TypeWrapper } from './TypeWrapper';
import { IconWrapper } from './IconWrapper';
import { Type } from './Type';
import { SurgeryCategoriesNames } from './SurgeryCategoriesNames';

import { TabType } from '~/core/TabUtil';
import { MemoWrapper } from './MemoWrapper';

const RegistrationCardWrapper = styled.div`
  margin: 5px 0;
`;

export const RegistrationConnectChart = ({ chart }) => {
  const { getIconByType, getValue } = useChartCard();
  const { openForm } = useContext(CustomerChartContext);
  const { get } = useFetch();

  const openEditForm = async (type, id) => {
    if (!type) return;
    const resp = await get(`${StatusConfig[type].apiPath}/${id}`);
    openForm(
      convertFormData({
        ...resp.data,
        type: type,
      })
    );
  };

  const { key, value } = chart;
  const { icon, type } = getIconByType({
    [getValue(key)]: value,
  });

  return (
    value.length > 0 &&
    value.map((v) => (
      <RegistrationCardWrapper key={v.id}>
        <TypeWrapper onClick={() => openEditForm(type, v.id)}>
          <IconWrapper>{icon}</IconWrapper>
          <Type>{TabType.getName(key)}</Type>
          <IconWrapper>
            <ArrowRightFill />
          </IconWrapper>
        </TypeWrapper>
        {key === TabType.appointment && v.category !== 'NONE' && (
          <>
            <ManagerNames item={v} />
            <div>{v.acquisitionChannel?.name}</div>
            <SurgeryCategoriesNames item={v} />
          </>
        )}
        {(key === TabType.surgery ||
          key === TabType.skinCare ||
          key === TabType.payment) && (
          <SurgeryCategoriesNames
            item={{ category: 'NONE', [getValue(key)]: [v] }}
          />
        )}
        {v.memo !== null && v.memo !== '' && (
          <MemoWrapper type={key}>
            <QuillText
              value={v.memo}
              maxLine={3}
              style={{ lineHeight: '1.4', width: 'auto' }}
            />
          </MemoWrapper>
        )}
      </RegistrationCardWrapper>
    ))
  );
};
