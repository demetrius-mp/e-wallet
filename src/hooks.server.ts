import { type Handle, type HandleServerError, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { checkIsTheme } from '$lib/components/ThemeSwitch.svelte';
import { getUserFromJwt } from '$lib/server/auth/jwt';

const handleUser = async function ({ event, resolve }) {
	const jwt = event.cookies.get('jwt');
	const user = await getUserFromJwt(jwt);
	event.locals.currentUser = user;

	const routeId = event.route.id;
	if (routeId?.startsWith('/app')) {
		if (!user) {
			redirect(302, '/sign-in');
		}
	}

	return await resolve(event);
} satisfies Handle;

const handleTheme = async function ({ event, resolve }) {
	const cookieTheme = event.cookies.get('theme');
	const theme = checkIsTheme(cookieTheme) ? cookieTheme : 'light';

	return await resolve(event, {
		transformPageChunk({ html }) {
			return html.replace('%app.data-theme%', theme);
		}
	});
} satisfies Handle;

export const handle = sequence(handleUser, handleTheme);

export const handleError = function ({ status }) {
	if (status === 404) {
		return {
			message: 'Page not found'
		};
	} else if (status === 500) {
		return {
			message: 'An unexpected error occurred'
		};
	}
} satisfies HandleServerError;
