import { transactionSchema, transformTransactionFormData } from '$lib/schemas';
import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (e) => {
	const { currentUser } = await e.parent();

	const transactionId = parseInt(e.params.transactionId);

	const transaction = await db.transaction.findFirst({
		where: {
			archived: false,
			id: transactionId,
			userId: currentUser.id
		},
		omit: {
			archived: true,
			userId: true
		}
	});

	if (transaction === null) {
		error(404, { message: 'Transação não encontrada' });
	}

	const form = await superValidate(zod(transactionSchema));

	const groups = await db.group.findMany({
		where: {
			userId: currentUser.id
		},
		take: 10
	});

	return {
		form,
		transaction,
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

		const transactionId = parseInt(e.params.transactionId);

		const transaction = await db.transaction.findFirst({
			where: {
				archived: false,
				id: transactionId,
				userId: currentUser.id
			}
		});

		if (transaction === null) {
			error(404, { message: 'Transação não encontrada' });
		}

		await db.transaction.update({
			where: {
				archived: false,
				id: transactionId,
				userId: currentUser.id
			},
			data: {
				name: data.name,
				value: data.value,
				date: data.date,
				tags: data.tags,
				endsAt: data.endsAt,
				installments: data.installments,
				groupId: data.groupId
			}
		});

		redirectTo(e, 302, '/app/transactions');
	}
} satisfies Actions;
