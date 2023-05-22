import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApiFetch } from '~/hooks/useApiFetch';
import { useApi } from '~/components/providers/ApiProvider';
import { ScheduledSmsTable } from './ScheduledSmsTable';

export const ScheduledSmsTab = ({ appointment }) => {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const { sessionSmsApi } = useApi();

  const sessionsParams = useMemo(
    () => ({
      sessionId: appointment.id,
      limit: 999,
    }),
    []
  );

  const {
    data: sessions,
    loading,
    mutate,
  } = useApiFetch([sessionsParams], sessionSmsApi.getSessionSms);

  const sessionSmsParams = useMemo(
    () => ({
      limit: 300,
    }),
    []
  );

  const { data: sessionsHistories, loading: loadingHistories } = useApiFetch(
    [appointment.id, sessionSmsParams],
    sessionSmsApi.getSessionHistories
  );

  const sortingSessions = useMemo(() => {
    const sessionsData = sessions?.data;
    const sessionsHistoriesData = sessionsHistories?.data;
    if (sessionsData && sessionsHistoriesData) {
      const newSessions = sessionsHistoriesData.map((v) => {
        const list = sessionsData.filter((f) => f.sessionHistoryId === v.id);
        return list;
      });
      return newSessions.flat();
    }
  }, [sessions, sessionsHistories]);

  useEffect(() => {
    if (sessionsHistories?.data.length > 0) {
      mutate();
      const expandedItems = expanded.concat(sessionsHistories.data[0].id);
      setExpanded(expandedItems);
    }
  }, [sessionsHistories]);

  const onChangeExpanded = (items) => {
    setExpanded(items);
    setData(
      data.map((v) => {
        return {
          ...v,
          visible: items.includes(v.sessionHistoryId) ? true : false,
        };
      })
    );
  };

  return (
    <ScheduledSmsTable
      groupData={sessionsHistories?.data ?? []}
      sessionId={appointment.id}
      loading={loading || loadingHistories}
      load={() => mutate()}
      data={sortingSessions}
      expanded={expanded}
      onChangeExpanded={onChangeExpanded}
    />
  );
};

ScheduledSmsTab.propTypes = {
  appointment: PropTypes.object,
};
