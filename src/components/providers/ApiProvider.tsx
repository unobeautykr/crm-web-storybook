import { ApiClient } from '~/api/apiClient';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    return new ApiClient({
      endpoint: import.meta.env.VITE_API_URL,
    });
  }, []);

  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

ApiProvider.propTypes = {
  children: PropTypes.node,
};

export function useApi() {
  return useContext(ApiContext) as ApiClient;
}
