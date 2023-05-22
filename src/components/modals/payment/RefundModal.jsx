import { useFetch } from 'use-http';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import RefundForm from './RefundForm';

const RefundModal = ({ options, close }) => {
  const { data } = useFetch(`/payments/${options.paymentId}`, [options]);
  return (
    <>
      {data && (
        <RefundForm options={options} close={close} payment={data.data} />
      )}
    </>
  );
};

RefundModal.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(RefundModal);
