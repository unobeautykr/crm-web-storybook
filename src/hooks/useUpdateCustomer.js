import { useFetch } from 'use-http';

export const useUpdateCustomer = ({ customerId, callback }) => {
  const { put: putCustomer } = useFetch(`/customers/${customerId}`);
  const updateCustomer = async (obj = {}) => {
    await putCustomer(
      // obj[name]이 Null인 경우는 제외
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
    );
    callback?.();
  };

  return { updateCustomer };
};
