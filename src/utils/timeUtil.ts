export interface Time {
  hours: number;
  minutes: number;
}

export function parseTime(timeStr: string): Time {
  const [hours, minutes] = timeStr.split(':');

  return {
    hours: Number(hours),
    minutes: Number(minutes),
  };
}

export function toMinutes(time: Time): number {
  return time.hours * 60 + time.minutes;
}

export function minutesToTime(minutes: number): Time {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}
