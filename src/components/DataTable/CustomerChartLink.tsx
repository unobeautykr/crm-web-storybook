import PropTypes from 'prop-types';
import styled from 'styled-components';
import hooks from '~/hooks';

const Button = styled.button`
  display: flex;
  margin: auto;
  text-decoration: underline;
  color: #0060ff;
  font-size: 12px;
  font-weight: 500;
  white-space: pre-line;
  width: max-content;
  max-width: -webkit-fill-available;
  word-break: keep-all;
`;

interface customer {
  name: string;
  id: number;
}

export function CustomerChartLink({
  customer,
  tab,
  close,
  active = true,
  style,
}: {
  customer: customer;
  tab: string;
  close: () => void;
  active: boolean;
  style: any;
}) {
  const openCustomerChart = () => {
    if (close) {
      close();
    }
    hooks.openCustomerChartNew({
      customerId: customer.id,
      tab: tab,
      form: { type: tab },
    });
  };

  return (
    <Button style={style} onClick={() => active && openCustomerChart()}>
      {customer.name ? customer.name : '-'}
    </Button>
  );
}

CustomerChartLink.propTypes = {
  customer: PropTypes.object,
  tab: PropTypes.string,
  close: PropTypes.func,
  active: PropTypes.bool,
  style: PropTypes.object,
};
