import { date } from '$lib/utils/date';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	type Transaction = {
		id: number;
		name: string;
		value: number;
		date: Date;
		endsAt: Date | null;
		tags: string[];
	};

	const transactions: Transaction[] = [
		{
			id: 1,
			name: 'Creatina',
			value: 30,
			date: date('17/08/2024', 'DD/MM/YYYY').utc(true).toDate(),
			endsAt: date('01/09/2024', 'DD/MM/YYYY').utc(true).toDate(),
			tags: []
		},
		{
			id: 2,
			name: 'Whey Protein',
			value: 114,
			date: date('17/06/2024', 'DD/MM/YYYY').utc(true).toDate(),
			endsAt: date('01/07/2024', 'DD/MM/YYYY').utc(true).toDate(),
			tags: []
		},
		{
			id: 3,
			name: 'Netflix',
			value: 59,
			date: date('17/05/2024', 'DD/MM/YYYY').utc(true).toDate(),
			endsAt: null,
			tags: []
		}
	];

	return {
		transactions,
		search: '',
		count: transactions.length
	};
}) satisfies PageServerLoad;
