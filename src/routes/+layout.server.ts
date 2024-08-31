import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load = loadFlash(async function (e) {
	return {
		currentUser: e.locals.currentUser
	};
}) satisfies LayoutServerLoad;
