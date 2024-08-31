import { date } from '$lib/utils/date';

export function filterTransactions<
	T extends {
		name: string;
		endsAt: Date | null;
		date: Date;
	}
>(options: { date: string; query: string; transactions: T[] }): T[] {
	const minDate = date(options.date, 'MM/YYYY').utc(true);

	return options.transactions.filter((transaction) => {
		const lowerCaseQuery = options.query?.toLowerCase();

		const checkMatchesQuery = () => {
			if (lowerCaseQuery === undefined || lowerCaseQuery.length === 0) {
				return true;
			}

			return transaction.name.toLowerCase().startsWith(lowerCaseQuery);
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
