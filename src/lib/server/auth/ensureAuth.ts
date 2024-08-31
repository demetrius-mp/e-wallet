import { redirect, type RequestEvent } from '@sveltejs/kit';

export function ensureAuth(e: RequestEvent) {
	if (!e.locals.currentUser) {
		throw redirect(302, '/sign-in');
	}

	return e.locals.currentUser;
}
