import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import type { Actions } from './$types';

export const actions = {
	async default(e) {
		const currentUser = ensureAuth(e);
		const groupId = parseInt(e.params.groupId);

		await db.group.delete({
			where: {
				id: groupId,
				userId: currentUser.id
			}
		});

		redirectTo(e, 302, '/app/groups');
	}
} satisfies Actions;
