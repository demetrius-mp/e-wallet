import { signInSchema } from '$lib/schemas';
import { generateJwt } from '$lib/server/auth/jwt';
import { verifyPassword } from '$lib/server/auth/password';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	if (currentUser !== undefined) {
		redirectTo(e, 302, '/app');
	}

	const form = await superValidate(zod(signInSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async function (e) {
		const form = await superValidate(e.request, zod(signInSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const existingUser = await db.user.findUnique({
			where: {
				archived: false,
				email: data.email
			},
			select: {
				id: true,
				password: true
			}
		});

		if (existingUser === null) {
			return setError(form, 'Email ou senha inválidos');
		}

		const passwordIsCorrect = await verifyPassword(form.data.password, existingUser.password);

		if (!passwordIsCorrect) {
			return setError(form, 'Email ou senha inválidos');
		}

		const jwt = generateJwt({
			userId: existingUser.id
		});

		e.cookies.set('jwt', jwt, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24
		});

		setFlash(
			{
				kind: 'success',
				message: 'Signed in successfully',
				asToast: true
			},
			e
		);

		redirectTo(e, 302, '/app');
	}
} satisfies Actions;
