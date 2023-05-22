import { createContext, useContext, useMemo } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import moment from 'moment';
import * as $http from 'axios';

export const DayType = {
  holiday: 'holiday',
  saturday: 'saturday',
  none: 'none',
};

class Holiday {
  loadedMonths = [];
  holidays = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadBetween = async (startDay, endDay) => {
    const calenderStartDay = moment(startDay)
      .startOf('month')
      .startOf('isoweek')
      .format('YYYY-MM-DD');
    const calendarEndDay = moment(endDay)
      .endOf('month')
      .endOf('isoweek')
      .format('YYYY-MM-DD');

    const resp = await $http.get(`/holidays`, {
      params: {
        locdateStartAt: calenderStartDay,
        locdateEndAt: calendarEndDay,
        orderBy: 'locdate asc',
      },
    });
    return resp.data;
  };

  load = async (startDate) => {
    const startMonth = moment(startDate).format('YYYY-MM');

    if (this.loadedMonths.indexOf(startMonth) === -1) {
      this.loadedMonths = this.loadedMonths.concat(startMonth);
      try {
        const list = await this.loadBetween(startDate, startDate);
        runInAction(() => {
          this.holidays = this.holidays.concat(
            list.filter(
              (v) => !this.holidays.find((f) => f.locdate === v.locdate)
            )
          );
        });
      } catch (e) {
        runInAction(() => {
          this.loadedMonths = this.loadedMonths.filter((f) => f !== startMonth);
        });
      }
    }
  };

  isHoliday(isoDate) {
    if (this.loadedMonths.indexOf(moment(isoDate).format('YYYY-MM')) === -1) {
      this.load(isoDate);
    }
    return this.holidays.find((d) => d.locdate === isoDate);
  }

  getDayType(date) {
    if (
      this.isHoliday(moment(date).format('YYYY-MM-DD')) ||
      date.getDay() === 0
    )
      return DayType.holiday;

    if (date.getDay() === 6) return DayType.saturday;

    return DayType.none;
  }
}

const HolidayContext = createContext();

/**
 *
 * @returns {Holiday}
 */
export const useHoliday = () => {
  return useContext(HolidayContext);
};

export const HolidayProvider = (props) => {
  const store = useMemo(() => new Holiday(), []);
  return <HolidayContext.Provider value={store} {...props} />;
};
