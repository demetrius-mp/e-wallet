import { db } from '$lib/server/db';
import { checkIsTimezone, date } from '$lib/utils/date';
import type { PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	const cookiesTimezone = e.cookies.get('timezone');
	const timezone = checkIsTimezone(cookiesTimezone) ? cookiesTimezone : date.tz.guess();
	const thisMonth = date.tz(new Date(), timezone).utc(true).startOf('month').toDate();

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
		orderBy: [
			{
				date: 'desc'
			},
			{
				value: 'desc'
			}
		],
		include: {
			group: {
				select: {
					id: true,
					name: true
				}
			}
		},
		omit: {
			userId: true,
			archived: true,
			groupId: true
		}
	});

	return {
		transactions
	};
}) satisfies PageServerLoad;
