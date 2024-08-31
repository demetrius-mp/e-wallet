import { editAccountSchema } from '$lib/schemas';
import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { verifyPassword } from '$lib/server/auth/password';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	const form = await superValidate(zod(editAccountSchema));

	form.data = {
		name: currentUser.name,
		email: currentUser.email,
		password: ''
	};

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	async default(e) {
		const currentUser = ensureAuth(e);

		const form = await superValidate(e, zod(editAccountSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const anotherUserWithEmail = await db.user.findFirst({
			where: {
				email: form.data.email,
				id: {
					not: currentUser.id
				}
			},
			select: {
				id: true
			}
		});

		if (anotherUserWithEmail !== null) {
			setError(form, 'email', 'Email já cadastrado');

			return fail(400, { form });
		}

		const currentUserData = await db.user.findFirst({
			where: {
				id: currentUser.id
			},
			select: {
				password: true
			}
		});

		if (!currentUserData) {
			error(401, 'Usuário autenticado não encontrado');
		}

		const passwordMatches = await verifyPassword(form.data.password, currentUserData.password);

		if (!passwordMatches) {
			setError(form, 'password', 'Senha incorreta');

			return fail(400, { form });
		}

		await db.user.update({
			where: {
				id: currentUser.id
			},
			data: {
				name: form.data.name,
				email: form.data.email
			}
		});

		setFlash(
			{
				kind: 'success',
				asToast: true,
				message: 'Conta atualizada com sucesso'
			},
			e
		);

		redirectTo(e, 302, '/app');
	}
} satisfies Actions;
