import { date } from '$lib/utils/date';
import { z } from 'zod';
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

	const getDefaultDate = () => date().utc(true).add(1, 'month').format('MM/YYYY');

	const searchParamsSchema = z.object({
		groupId: z.coerce.number().optional().catch(undefined),
		term: z.string().catch(''),
		field: z.enum(['tags', 'name']).catch('name'),
		date: z
			.string()
			.transform((value) => {
				if (date(value, 'MM/YYYY', true).isValid()) {
					return value;
				}

				return getDefaultDate();
			})
			.catch(getDefaultDate())
	});

	const searchParams = searchParamsSchema.parse(Object.fromEntries(e.url.searchParams));

	return {
		...e.data,
		minDate: minDate.format('MM/YYYY'),
		maxDate: maxDate.format('MM/YYYY'),
		searchParams
	};
}) satisfies PageLoad;
