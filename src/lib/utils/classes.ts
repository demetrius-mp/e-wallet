export function classes(...args: unknown[]) {
	return args
		.flat()
		.filter((x) => typeof x === 'string')
		.join(' ')
		.trim();
}
