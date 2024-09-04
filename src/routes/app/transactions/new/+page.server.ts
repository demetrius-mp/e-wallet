import { transactionSchema, transformTransactionFormData } from '$lib/schemas';
import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	const form = await superValidate(zod(transactionSchema));

	const groups = await db.group.findMany({
		where: {
			userId: currentUser.id
		},
		omit: {
			userId: true
		},
		take: 10
	});

	return {
		form,
		groups
	};
}) satisfies PageServerLoad;

export const actions = {
	async default(e) {
		const currentUser = ensureAuth(e);

		const form = await superValidate(e.request, zod(transactionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const data = transformTransactionFormData(form.data);

		await db.transaction.create({
			data: {
				userId: currentUser.id,
				name: data.name,
				value: data.value,
				date: data.date,
				tags: data.tags,
				endsAt: data.endsAt,
				installments: data.installments,
				groupId: data.groupId
			}
		});

		if (data.saveAndContinue) {
			setFlash(
				{
					kind: 'success',
					message: 'Transação criada com sucesso',
					asToast: true
				},
				e
			);

			redirectTo(e, 302, '/app/transactions/new');
		} else {
			redirectTo(e, 302, '/app/transactions');
		}
	}
} satisfies Actions;
