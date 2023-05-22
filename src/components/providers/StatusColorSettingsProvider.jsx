import { createContext, useCallback, useContext, useMemo } from 'react';
import services from '~/services';
import { StatusColor } from '~/core/statusColor';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useApi } from './ApiProvider';
import { useApiFetch } from '~/hooks/useApiFetch';

const defaultSettings = [
  {
    id: StatusColor.scheduled,
    backgroundColor: '#F4C442',
    textColor: '#000',
  },
  {
    id: StatusColor.canceled,
    backgroundColor: '#E85A54',
    textColor: '#000',
  },
  {
    id: StatusColor.no_show,
    backgroundColor: '#293141',
    textColor: '#000',
  },
  {
    id: StatusColor.consulting_waiting,
    backgroundColor: '#56B1E4',
    textColor: '#000',
  },
  {
    id: StatusColor.consulting_during,
    backgroundColor: '#5080FA',
    textColor: '#000',
  },
  {
    id: StatusColor.treatment_waiting,
    backgroundColor: '#8692FF',
    textColor: '#000',
  },
  {
    id: StatusColor.treatment_during,
    backgroundColor: '#675FEF',
    textColor: '#000',
  },
  {
    id: StatusColor.surgery_waiting,
    backgroundColor: '#FF883D',
    textColor: '#000',
  },
  {
    id: StatusColor.surgery_during,
    backgroundColor: '#FF508C',
    textColor: '#000',
  },
  {
    id: StatusColor.payment_waiting,
    backgroundColor: '#D1E20F',
    textColor: '#000',
  },
  {
    id: StatusColor.complete,
    backgroundColor: '#727776',
    textColor: '#000',
  },
  {
    id: StatusColor.leave,
    backgroundColor: '#C1C1C1',
    textColor: '#000',
  },
  {
    id: StatusColor.absence,
    backgroundColor: '#A4A4A4',
    textColor: '#000',
    hideFilter: true,
  },
  {
    id: StatusColor.registration_canceled,
    backgroundColor: '#333333',
    textColor: '#000',
  },
];

const unknownSettings = {
  id: StatusColor.unknown,
  backgroundColor: '#8a8a8a',
  textColor: '#000',
};

const StatusColorSettingsContext = createContext(null);

function parseSettings(settings) {
  return settings.map(parseStatusSettingsItem);
}

function parseStatusSettingsItem(item) {
  return {
    id: convertId(item.id),
    backgroundColor: item.backgroundColor,
    textColor: item.textColor,
  };
}

function convertId(colorId) {
  switch (colorId) {
    case 'unvisited':
      return StatusColor.no_show;
    default:
      return colorId.toUpperCase();
  }
}

export const StatusColorSettingsProvider = observer(({ children }) => {
  const { appointmentApi } = useApi();

  const { data, mutate } = useApiFetch(
    ['calendarStatusInfo'],
    appointmentApi.getConfig
  );

  const userSettings = useMemo(() => {
    if (!data) return [];
    return data.data.configValue
      ? parseSettings(JSON.parse(data.data.configValue))
      : [];
  }, [data]);

  const settings = useMemo(
    () =>
      defaultSettings.map((c) => {
        const statusUserSettings = userSettings.find((u) => u.id == c.id);

        return {
          id: c.id,
          backgroundColor:
            statusUserSettings?.backgroundColor ?? c.backgroundColor,
          textColor: statusUserSettings?.textColor ?? c.textColor,
        };
      }),
    [userSettings]
  );

  const getStatusSettings = useCallback(
    (id) => {
      const colorSettings = settings.find((c) => c.id == id);
      if (!colorSettings) {
        return unknownSettings;
      }

      return colorSettings;
    },
    [settings]
  );

  const updateSettings = useCallback(
    async (config) => {
      await services.crm.crud.appointment.configs_v2.create({
        configKey: 'calendarStatusInfo',
        configValue: JSON.stringify(config),
      });

      mutate();
    },
    [mutate]
  );

  const providerValue = useMemo(
    () => ({
      getStatusSettings: getStatusSettings,
      updateSettings: updateSettings,
      settings: settings,
      defaultSettings: defaultSettings,
    }),
    [settings, getStatusSettings, updateSettings]
  );

  return (
    <StatusColorSettingsContext.Provider value={providerValue}>
      {children}
    </StatusColorSettingsContext.Provider>
  );
});

StatusColorSettingsProvider.propTypes = {
  children: PropTypes.node,
};

export function useStatusColorSettings() {
  return useContext(StatusColorSettingsContext);
}
