import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	const search = e.url.searchParams.get('search') || '';

	const groups = await db.group.findMany({
		where: {
			userId: currentUser.id,
			name: {
				startsWith: search
			}
		},
		select: {
			id: true,
			name: true
		},
		take: 10
	});

	return {
		groups,
		search
	};
}) satisfies PageServerLoad;
