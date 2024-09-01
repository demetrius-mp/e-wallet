import { transactionSchema, transformTransactionFormData } from '$lib/schemas';
import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const form = await superValidate(zod(transactionSchema));

	return {
		form
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
				installments: data.installments
			}
		});

		redirectTo(e, 302, '/app/transactions');
	}
} satisfies Actions;
