import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import type { Actions } from './$types';

export const actions = {
	async default(e) {
		const currentUser = ensureAuth(e);
		const transactionId = parseInt(e.params.transactionId);

		await db.transaction.update({
			where: {
				id: transactionId,
				userId: currentUser.id,
				archived: false
			},
			data: {
				archived: true
			}
		});

		redirectTo(e, 302, '/app/transactions');
	}
} satisfies Actions;
