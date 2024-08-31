import { resetPasswordSchema } from '$lib/schemas';
import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { generatePasswordHash, verifyPassword } from '$lib/server/auth/password';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const form = await superValidate(zod(resetPasswordSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	async default(e) {
		const currentUser = ensureAuth(e);

		const form = await superValidate(e, zod(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await db.user.findFirst({
			where: {
				id: currentUser.id
			},
			select: {
				password: true
			}
		});

		if (!user) {
			error(401, 'Usuário autenticado não encontrado');
		}

		const passwordMatches = await verifyPassword(form.data.currentPassword, user.password);

		if (!passwordMatches) {
			setError(form, 'currentPassword', 'Senha incorreta');

			return fail(400, { form });
		}

		const hashedPassword = await generatePasswordHash(form.data.newPassword);

		await db.user.update({
			where: {
				id: currentUser.id
			},
			data: {
				password: hashedPassword
			}
		});

		setFlash(
			{
				kind: 'success',
				asToast: true,
				message: 'Senha atualizada com sucesso'
			},
			e
		);

		redirectTo(e, 302, '/app');
	}
} satisfies Actions;
