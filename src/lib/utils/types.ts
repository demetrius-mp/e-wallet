export type HTMLInputAutocompleteAttribute =
	| 'on'
	| 'off'
	| 'address-line1'
	| 'address-line2'
	| 'address-line3'
	| 'address-level1'
	| 'address-level2'
	| 'address-level3'
	| 'address-level4'
	| 'street-address'
	| 'country'
	| 'country-name'
	| 'postal-code'
	| 'name'
	| 'additional-name'
	| 'family-name'
	| 'given-name'
	| 'honoric-prefix'
	| 'honoric-suffix'
	| 'nickname'
	| 'organization-title'
	| 'username'
	| 'new-password'
	| 'current-password'
	| 'bday'
	| 'bday-day'
	| 'bday-month'
	| 'bday-year'
	| 'sex'
	| 'one-time-code'
	| 'organization'
	| 'cc-name'
	| 'cc-given-name'
	| 'cc-additional-name'
	| 'cc-family-name'
	| 'cc-number'
	| 'cc-exp'
	| 'cc-exp-month'
	| 'cc-exp-year'
	| 'cc-csc'
	| 'cc-type'
	| 'transaction-currency'
	| 'transaction-amount'
	| 'language'
	| 'url'
	| 'email'
	| 'photo'
	| 'tel'
	| 'tel-country-code'
	| 'tel-national'
	| 'tel-area-code'
	| 'tel-local'
	| 'tel-local-prefix'
	| 'tel-local-suffix'
	| 'tel-extension'
	| 'impp';

type ExpandRecursively<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: ExpandRecursively<O[K]> }
		: never
	: T;

export type PartialBy<T, K extends keyof T> = ExpandRecursively<Omit<T, K> & Partial<Pick<T, K>>>;

export type RecursiveRequired<T> = ExpandRecursively<
	Required<{
		[P in keyof T]: T[P] extends object | undefined ? RecursiveRequired<Required<T[P]>> : T[P];
	}>
>;

export type RequiredFields<T, K extends keyof T> = ExpandRecursively<T & Required<Pick<T, K>>>;
