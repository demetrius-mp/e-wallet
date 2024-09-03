import { groupSchema } from '$lib/schemas';
import { ensureAuth } from '$lib/server/auth/ensureAuth';
import { db } from '$lib/server/db';
import { redirectTo } from '$lib/server/redirectTo';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (e) => {
	const currentUser = ensureAuth(e);

	const groupId = parseInt(e.params.groupId);

	const group = await db.group.findFirst({
		where: {
			id: groupId,
			userId: currentUser.id
		}
	});

	if (group === null) {
		error(404, { message: 'Grupo não encontrado' });
	}

	const form = await superValidate(zod(groupSchema));

	form.data = {
		name: group.name
	};

	return {
		form,
		group
	};
}) satisfies PageServerLoad;

export const actions = {
	async default(e) {
		const currentUser = ensureAuth(e);

		const form = await superValidate(e, zod(groupSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const group = await db.group.create({
			data: {
				name: form.data.name,
				userId: currentUser.id
			}
		});

		redirectTo(e, 302, `/app/groups/${group.id}`);
	}
} satisfies Actions;
