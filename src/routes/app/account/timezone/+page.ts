import type { PageLoad } from './$types';

export const load = (async (e) => {
	const form = e.data.form;

	const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	form.data = {
		timezone: detectedTimezone
	};

	return {
		...e.data,
		detectedTimezone
	};
}) satisfies PageLoad;
