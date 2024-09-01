export function joinBy<T>(array: T[], by: (item: T) => string, separator: string = ','): string {
	let result = '';

	array.forEach((item, index) => {
		result += by(item);

		if (index < array.length - 1) {
			result += separator;
		}
	});

	return result;
}
