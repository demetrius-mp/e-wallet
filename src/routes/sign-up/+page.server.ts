import { signUpSchema } from '$lib/schemas';
import { generatePasswordHash } from '$lib/server/auth/password';
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

	const form = await superValidate(zod(signUpSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	async default(e) {
		const form = await superValidate(e.request, zod(signUpSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const existingUser = await db.user.findFirst({
			where: {
				archived: false,
				email: data.email
			},
			select: {
				id: true
			}
		});

		if (existingUser !== null) {
			setError(form, 'email', 'Email já cadastrado');

			return fail(400, { form });
		}

		const hashedPassword = await generatePasswordHash(form.data.password);

		await db.user.create({
			data: {
				name: form.data.name,
				email: form.data.email,
				password: hashedPassword
			}
		});

		setFlash(
			{
				kind: 'success',
				message: 'Conta criada com sucesso',
				asToast: true
			},
			e
		);

		redirectTo(e, 302, '/sign-in');
	}
} satisfies Actions;
