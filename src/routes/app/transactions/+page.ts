import { date } from '$lib/utils/date';
import type { PageLoad } from './$types';

export const load = (async (e) => {
	let minDate = date(new Date()).startOf('month').utc(true);
	let maxDate = date(new Date()).startOf('month').utc(true);

	e.data.transactions.forEach((t) => {
		if (!t.endsAt) return;

		const transactionEndsAt = date.utc(t.endsAt);

		if (transactionEndsAt.isBefore(minDate)) {
			minDate = transactionEndsAt;
		}

		if (transactionEndsAt.isAfter(maxDate)) {
			maxDate = transactionEndsAt;
		}
	});

	maxDate = maxDate.add(1, 'month');

	return {
		...e.data,
		minDate: minDate.format('MM/YYYY'),
		maxDate: maxDate.format('MM/YYYY')
	};
}) satisfies PageLoad;
