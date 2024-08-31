import { redirect } from '@sveltejs/kit';

import { setFlash } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';

export const actions = {
	default(e) {
		e.cookies.set('jwt', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24
		});

		setFlash(
			{
				kind: 'success',
				message: 'Signed out successfully',
				asToast: true
			},
			e
		);

		redirect(302, '/');
	}
} satisfies Actions;
