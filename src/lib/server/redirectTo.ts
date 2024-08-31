import { redirect, type RequestEvent } from '@sveltejs/kit';

export function redirectTo(data: RequestEvent, fallbackStatus?: number, fallbackLocation?: string) {
	const redirectTo = data.url.searchParams.get('redirectTo');

	if (redirectTo) {
		redirect(302, `/${redirectTo.slice(1)}`);
	}

	if (fallbackStatus && fallbackLocation) {
		redirect(fallbackStatus, fallbackLocation);
	}
}
