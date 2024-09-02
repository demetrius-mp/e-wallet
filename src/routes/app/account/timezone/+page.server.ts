import { timezoneSchema } from '$lib/schemas';
import { redirectTo } from '$lib/server/redirectTo';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const form = await superValidate(zod(timezoneSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	async default(e) {
		const form = await superValidate(e, zod(timezoneSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		e.cookies.set('timezone', form.data.timezone, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 365
		});

		redirectTo(e, 302, '/app/transactions');
	}
} satisfies Actions;
