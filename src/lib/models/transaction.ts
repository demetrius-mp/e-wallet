import { date } from '$lib/utils/date';

export function filterTransactions<
	T extends {
		name: string;
		endsAt: Date | null;
		date: Date;
		tags: string[];
	}
>(options: { date: string; query: string; transactions: T[]; queryField: 'name' | 'tags' }): T[] {
	const minDate = date(options.date, 'MM/YYYY').utc(true);

	return options.transactions.filter((transaction) => {
		const query = options.query.toLowerCase();

		const checkMatchesQuery = () => {
			if (query === undefined || query.length === 0) {
				return true;
			}

			if (options.queryField === 'tags') {
				return transaction.tags.some((tag) => tag === query);
			}

			return transaction.name.toLowerCase().startsWith(query);
		};

		const transactionDate = date.utc(transaction.date);
		const happenedBeforeMinDate = transactionDate.isBefore(minDate);

		if (transaction.endsAt === null) {
			return happenedBeforeMinDate && checkMatchesQuery();
		}

		const transactionEndsAtDate = date.utc(transaction.endsAt);

		const endsAfterMinDate = transactionEndsAtDate.isAfter(minDate);
		const endsAtSameMonth = transactionEndsAtDate.isSame(minDate, 'month');

		const matchesDate = happenedBeforeMinDate && (endsAfterMinDate || endsAtSameMonth);

		return matchesDate && checkMatchesQuery();
	});
}
