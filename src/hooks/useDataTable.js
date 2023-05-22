import { useState, useCallback } from 'react';

export function useDataTable({ sorts: defaultSorts }) {
  const [sorts, setSorts] = useState([defaultSorts]);

  const [checked, onChangeChecked] = useState([]);

  const onChangeSorts = useCallback((id, value) => {
    setSorts([
      {
        id,
        value,
      },
    ]);
  }, []);

  return { sorts, onChangeSorts, checked, onChangeChecked };
}
