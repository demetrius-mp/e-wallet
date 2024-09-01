import { date } from '$lib/utils/date';
import type { PageLoad } from './$types';

export const load = (async (e) => {
	const form = e.data.form;

	form.data.date = date().utc(true).format('DD/MM/YY');
	form.data.endsAt = 'Recorrente';

	return {
		form
	};
}) satisfies PageLoad;
