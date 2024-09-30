import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.locale('pt-br');

export const date = dayjs;

export function getDatesDiffInMonths(d1: Date, d2: Date) {
	const start = date.utc(d1).startOf('month');
	const end = date.utc(d2).startOf('month');

	const diff = end.diff(start, 'month');

	return diff;
}

export function checkIsTimezone(tz: unknown): tz is string {
	return typeof tz === 'string' && Intl.supportedValuesOf('timeZone').includes(tz);
}
