import { db } from '$lib/server/db';
import { date } from '$lib/utils/date';
import type { PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	const thisMonth = date().startOf('month').toDate();

	const transactions = await db.transaction.findMany({
		where: {
			archived: false,
			userId: currentUser.id,
			OR: [
				{
					endsAt: {
						gte: thisMonth
					}
				},
				{
					endsAt: null
				}
			]
		},
		orderBy: {
			date: 'desc'
		},
		omit: {
			userId: true,
			archived: true
		}
	});

	return {
		transactions,
		search: '',
		count: transactions.length
	};
}) satisfies PageServerLoad;
