import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	if (currentUser) {
		redirect(302, '/app');
	}
}) satisfies PageServerLoad;
