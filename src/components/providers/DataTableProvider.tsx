import { createContext, ReactNode } from 'react';
import PropTypes from 'prop-types';

type ChartContext = {
  openForm: () => void;
  setFormData: () => void;
  setEditingForm: () => void;
};

export const CustomerChartContext = createContext<ChartContext | null>(null);

export function DataTableProvider({ children }: { children: ReactNode }) {
  return (
    <CustomerChartContext.Provider
      value={{
        openForm: () => {},
        setFormData: () => {},
        setEditingForm: () => {},
      }}
    >
      {children}
    </CustomerChartContext.Provider>
  );
}

DataTableProvider.propTypes = {
  children: PropTypes.node,
};
