import { date } from '$lib/utils/date';
import type { PageLoad } from './$types';

export const load = (async (e) => {
	const form = e.data.form;
	const transaction = e.data.transaction;

	form.data = {
		name: transaction.name,
		date: date.utc(transaction.date).format('DD/MM/YY'),
		value: transaction.value,
		tags: transaction.tags?.join(', ') || '',
		endsAt: transaction.endsAt ? date.utc(transaction.endsAt).format('MM/YY') : 'Recorrente',
		installments: transaction.installments,
		groupId: transaction.groupId || undefined,
		type: transaction.type
	};

	return {
		...e.data,
		form
	};
}) satisfies PageLoad;
