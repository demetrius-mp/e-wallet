import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const ssr = false;

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	if (!currentUser) {
		redirect(302, '/');
	}

	return {
		currentUser
	};
}) satisfies LayoutServerLoad;
