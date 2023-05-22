import { useFetch } from 'use-http';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import UnpaidForm from './UnpaidForm';

const UnpaidModal = ({ options, close }) => {
  const { data } = useFetch(`/payments/${options.paymentId}`, [options]);

  return (
    <>
      {data && (
        <UnpaidForm options={options} close={close} payment={data?.data} />
      )}
    </>
  );
};

UnpaidModal.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(UnpaidModal);
