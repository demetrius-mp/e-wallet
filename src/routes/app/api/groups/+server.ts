import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (e) => {
	const currentUser = ensureAuth(e);

	const search = e.url.searchParams.get('search') || '';

	const groups = await db.group.findMany({
		where: {
			userId: currentUser.id,
			name: {
				startsWith: search
			}
		},
		omit: {
			userId: true
		},
		take: 10
	});

	return json({ groups });
};
