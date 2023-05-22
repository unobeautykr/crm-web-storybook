import { Box } from '@mui/material';
import { useCallback, useEffect } from 'react';
import SortSelect from '~/components/crm/penchart/SortSelect';
import { useApi } from '~/components/providers/ApiProvider';

export const Sorter = ({
  sorts,
  setSorts,
}: {
  sorts: string;
  setSorts: (sort: string) => void;
}) => {
  const { userApi } = useApi();

  const loadSortConfig = useCallback(async () => {
    const resp = await userApi.getConfig('penchartSort');
    const sortValue = resp.data.value ? resp.data.value : 'created desc';
    setSorts(sortValue);
  }, [setSorts, userApi]);

  useEffect(() => {
    loadSortConfig();
  }, [loadSortConfig]);

  const onChangeSort = async (value: any) => {
    await userApi.updateConfig('penchartSort', value);
    setSorts(value);
  };
  return (
    <Box sx={{ width: '120px' }}>
      <SortSelect value={sorts} onChange={onChangeSort} />
    </Box>
  );
};
