import type { ParamMatcher } from '@sveltejs/kit';

export const match = function (param) {
	return /^\d+$/.test(param);
} satisfies ParamMatcher;
