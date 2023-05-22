import { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { phoneNumberFormatHyphen } from '~/utils/filters';
import QuillText from '~/components/quill/QuillText';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { SmsButton } from '~/components/crm/search/SmsButton';
import { UnderlineButton } from '~/components/UnderlineButton';
import { useChart } from '~/hooks/useChart';
import hooks from '~/hooks';

const Table = styled.table`
  text-align: left;
  line-height: 1.2;

  td,
  th {
    padding: 5px 0;
  }

  tr:nth-child(2n-1) {
    background: #f9fbff;
  }

  th {
    width: 68px;
    color: #a1b1ca;
    font-weight: 500;
    &:first-child {
      padding-left: 8px;
    }
  }

  td {
    min-width: 55px;
    color: #2d2d2d;
    &:last-child {
      padding-right: 8px;
    }
  }
`;
const PhoneNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  svg {
    width: 12px;
  }
`;

const EllipsisWrapper = styled.p`
  width: ${({ width }) => (width ? `${width}px` : '200px')};
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const ProfileDetailTable = ({ expanded }) => {
  const { customer } = useContext(CustomerChartContext);
  const chart = useChart();

  const birthday = () => {
    return customer.birthday
      ? `${customer.birthday.slice(2, 4)}-${customer.birthday.slice(
          5,
          7
        )}-${customer.birthday.slice(-2)}`
      : '-';
  };

  const onClickRecommender = (recommender) => {
    chart.hidden(customer.id);
    hooks.openCustomerChartNew({ customerId: recommender.id });
  };

  return (
    <Table>
      <tbody>
        <tr>
          <th>전화번호</th>
          <td colSpan="3">
            <PhoneNumberWrapper>
              {phoneNumberFormatHyphen(customer?.phoneNumber)}
              {customer?.phoneNumber && <SmsButton target={customer} />}
            </PhoneNumberWrapper>
          </td>
        </tr>
        <tr>
          <th>생년월일</th>
          <td>{birthday()}</td>
          <th>고객등급</th>
          <td>{customer?.level?.name ?? '-'}</td>
        </tr>
        <tr>
          <th>담당의</th>
          <td>{customer?.doctor?.name}</td>
          <th>담당상담</th>
          <td>{customer?.counselor?.name}</td>
        </tr>
        <tr>
          <th>관심항목</th>
          <td colSpan="3">
            {customer?.favorites?.map((v) => v.name).join(',') ?? '-'}
          </td>
        </tr>
        <tr>
          <th>소개자</th>
          <td colSpan="3">
            {customer?.recommender ? (
              <UnderlineButton
                size="s"
                onClick={() => onClickRecommender(customer?.recommender)}
              >
                {customer?.recommender.name}({customer?.recommender.chartNo})
              </UnderlineButton>
            ) : (
              '-'
            )}
          </td>
        </tr>
        <tr>
          <th>내원경로</th>
          <td colSpan="3">
            <EllipsisWrapper>
              {customer.acquisitionChannels &&
              customer.acquisitionChannels.length > 0
                ? customer.acquisitionChannels.map((v) => v.name).join(',')
                : '-'}
            </EllipsisWrapper>
          </td>
        </tr>
        <tr>
          <th>메모</th>
          <td colSpan="3">
            <QuillText
              value={customer?.memo}
              maxLine={4}
              style={{ lineHeight: '1.4', width: 'auto' }}
            />
          </td>
        </tr>
        {expanded && (
          <>
            <tr>
              <th>추가정보1</th>
              <td colSpan="3">{customer?.additionalInfo1 ?? '-'}</td>
            </tr>
            <tr>
              <th>추가정보2</th>
              <td colSpan="3">{customer?.additionalInfo2 ?? '-'}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td colSpan="3">
                <EllipsisWrapper>{customer?.address ?? '-'}</EllipsisWrapper>
              </td>
            </tr>
            <tr>
              <th>상세주소</th>
              <td colSpan="3">
                <EllipsisWrapper>
                  {customer?.addressDetail ?? '-'}
                </EllipsisWrapper>
              </td>
            </tr>
            <tr>
              <th>직업/직장</th>
              <td>
                <EllipsisWrapper width={50}>
                  {customer?.job?.name ?? '-'}
                </EllipsisWrapper>
              </td>
              <th>결혼여부</th>
              <td>
                {customer?.married == null
                  ? '-'
                  : customer?.married
                  ? '기혼'
                  : '미혼'}
              </td>
            </tr>
            <tr>
              <th>국가/지역</th>
              <td>
                <EllipsisWrapper width={50}>
                  {customer?.region?.name ?? '-'}
                </EllipsisWrapper>
              </td>
              <th>불만사항</th>
              <td>
                <EllipsisWrapper width={50}>
                  {customer?.complaint?.content ?? '-'}
                </EllipsisWrapper>
              </td>
            </tr>
          </>
        )}
      </tbody>
    </Table>
  );
};

ProfileDetailTable.propTypes = {
  expanded: PropTypes.bool,
};
