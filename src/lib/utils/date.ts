import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const date = dayjs;

export function getDatesDiffInMonths(d1: Date, d2: Date) {
	const start = date.utc(d1).startOf('month');
	const end = date.utc(d2).startOf('month');

	const diff = end.diff(start, 'month');

	return diff;
}
