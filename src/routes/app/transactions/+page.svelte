<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import Currency from '$lib/components/Currency.svelte';
	import FloatingButton from '$lib/components/FloatingButton.svelte';
	import MonthCalendar from '$lib/components/MonthCalendar.svelte';
	import { addToast } from '$lib/components/Toasts.svelte';
	import Popover from '$lib/components/UI/Popover.svelte';
	import Tooltip from '$lib/components/UI/Tooltip.svelte';
	import { filterTransactions } from '$lib/models/transaction.js';
	import { classes } from '$lib/utils/classes.js';
	import { date, getDatesDiffInMonths } from '$lib/utils/date.js';
	import { formatCurrency } from '$lib/utils/formatCurrency.js';
	import { fade } from 'svelte/transition';
	import IconCalendarMonth from '~icons/mdi/CalendarMonth';
	import IconClose from '~icons/mdi/Close';
	import IconContentCopy from '~icons/mdi/ContentCopy';
	import IconMagnify from '~icons/mdi/Magnify';
	import IconPlus from '~icons/mdi/Plus';

	export let data;

	type FilterTransactionOptions = {
		date: string;
		queryField: 'name' | 'tags';
		query: string;
		groupId?: number;
	};

	let filterTransactionOptions: FilterTransactionOptions = {
		date: data.searchParams.date,
		query: data.searchParams.term,
		queryField: data.searchParams.field,
		groupId: data.searchParams.groupId
	};

	let highlightedDate = filterTransactionOptions.date;

	async function setFilteredTransactions(options?: Partial<FilterTransactionOptions>) {
		filterTransactionOptions = Object.assign(filterTransactionOptions, options);

		filteredTransactions = filterTransactions({
			transactions: data.transactions,
			...filterTransactionOptions
		});

		const newSearchParams = $page.url.searchParams;

		if (filterTransactionOptions.groupId) {
			newSearchParams.set('groupId', filterTransactionOptions.groupId.toString());
		}

		newSearchParams.set('field', filterTransactionOptions.queryField);
		newSearchParams.set('term', filterTransactionOptions.query);
		newSearchParams.set('date', filterTransactionOptions.date);

		await goto(`?${newSearchParams.toString()}`);

		return filterTransactionOptions;
	}

	let filteredTransactions = filterTransactions({
		...filterTransactionOptions,
		transactions: data.transactions
	});

	$: bill = filteredTransactions.reduce((acc, transaction) => {
		const value = transaction.type === 'EXPENSE' ? -transaction.value : transaction.value;

		return acc + value;
	}, 0);

	function checkTagIsSelected(tag: string, filterTransactionOptions: FilterTransactionOptions) {
		if (filterTransactionOptions.queryField === 'tags') {
			return tag == filterTransactionOptions.query;
		}

		return false;
	}

	function checkGroupIsSelected(
		groupId: number,
		filterTransactionOptions: FilterTransactionOptions
	) {
		return groupId === filterTransactionOptions.groupId;
	}

	async function copyTransactionsToClipboard() {
		const initialReport = `Transações em ${filterTransactionOptions.date}\nValor total: ${formatCurrency(bill)}\n\n`;

		const report = filteredTransactions
			.reduce((acc, transaction) => {
				let line = `${transaction.name} - ${formatCurrency(transaction.value)}\n`;

				if (transaction.installments !== null) {
					const paidInstallments = getDatesDiffInMonths(
						transaction.date,
						date(filterTransactionOptions.date, 'MM/YYYY').utc(true).toDate()
					);

					if (transaction.installments === 1) {
						line += 'À vista';
					} else {
						line += `Parcela ${paidInstallments}/${transaction.installments}`;
					}
				} else {
					line += 'Recorrente';
				}

				if (transaction.type === 'EXPENSE') {
					line += ' (Despesa)';
				} else if (transaction.type === 'INCOME') {
					line += ' (Receita)';
				}

				line += '\n';

				return acc + line + '\n';
			}, initialReport)
			.trim();

		await navigator.clipboard.writeText(report);

		addToast({
			data: {
				kind: 'success',
				description: 'Copiado com sucesso!'
			},
			closeDelay: 3000
		});
	}
</script>

<svelte:head>
	<title>e-Wallet | Transações</title>
</svelte:head>

<div>
	<div class="flex items-baseline gap-2">
		<h2 class="text-2xl">Saldo</h2>
		<small> ({filterTransactionOptions.date}) </small>
	</div>

	<Currency
		class={classes('text-4xl font-extrabold', bill < 0 && 'text-error', bill > 0 && 'text-success')}
		value={bill}
	/>
</div>

<div class="divider my-1"></div>

<div class="flex items-center justify-between gap-2">
	<div>
		<h2 class="text-2xl">Transações</h2>
		<span class="text-sm">
			do mês {filterTransactionOptions.date}
		</span>
	</div>

	<div class="flex gap-2">
		<button class="btn btn-circle" on:click={copyTransactionsToClipboard}>
			<IconContentCopy class="text-xl" />
		</button>

		<Popover
			let:melt
			let:trigger
			let:open
			let:overlay
			let:content
			let:arrow
			let:close
			props={{
				forceVisible: true,
				positioning: {
					placement: 'bottom-end'
				}
			}}
		>
			<button use:melt={trigger} aria-label="Abrir calendário" class="btn btn-circle">
				<IconCalendarMonth class="text-xl" />
			</button>

			{#if open}
				<div use:melt={overlay} class="fixed inset-0 z-40" />

				<div use:melt={content} transition:fade={{ duration: 100 }} class="z-40">
					<div use:melt={arrow} />

					<div class="max-w-xs rounded-box bg-base-200 p-4 pt-2">
						<div class="flex items-center justify-between gap-2">
							<span class="text-lg font-bold"> Filtrar por mês </span>

							<button use:melt={close} aria-label="Fechar calendário" class="btn btn-circle btn-sm">
								<IconClose class="text-xl" />
							</button>
						</div>

						<span>
							Mês selecionado: {filterTransactionOptions.date}
						</span>

						<div class="divider my-0 mb-2"></div>

						<MonthCalendar
							min={data.minDate}
							max={data.maxDate}
							{highlightedDate}
							selectedDate={filterTransactionOptions.date}
							onChange={async (date) => {
								await setFilteredTransactions({
									date
								});
							}}
						/>
					</div>
				</div>
			{/if}
		</Popover>
	</div>
</div>

<div class="mt-4">
	<form
		on:submit={async (e) => {
			e.preventDefault();
			await setFilteredTransactions();
		}}
		class="join w-full"
	>
		<select
			name="queryField"
			bind:value={filterTransactionOptions.queryField}
			class="join-item select select-bordered text-[1rem]"
		>
			<option value="name">Nome</option>
			<option value="tags">Tags</option>
		</select>
		<input
			name="query"
			bind:value={filterTransactionOptions.query}
			class="input join-item input-bordered w-full"
			placeholder="Buscar transações"
		/>
		<button type="submit" class="btn join-item">
			<IconMagnify class="text-xl" />
		</button>
	</form>
</div>

<ul class="mt-4 flex flex-col">
	{#each filteredTransactions as transaction, i}
		<li>
			<a href="/app/transactions/{transaction.id}/edit">
				<div class="flex justify-between gap-2">
					<h3 class="text-lg font-bold">
						{transaction.name}
					</h3>

					<span class="text-lg" class:text-success={transaction.type === 'INCOME'}>
						<Currency value={transaction.value} />
					</span>
				</div>

				<div class="flex justify-between">
					<span class="text-sm">
						{date.utc(transaction.date).format('DD/MM/YY')}
					</span>

					<span class="text-nowrap text-sm">
						{#if transaction.endsAt !== null}
							{#if transaction.installments === 1}
								À vista
							{:else}
								{@const paidInstallments = getDatesDiffInMonths(
									transaction.date,
									date(filterTransactionOptions.date, 'MM/YYYY').utc(true).toDate()
								)}

								{paidInstallments}/{transaction.installments}
							{/if}
						{:else}
							Recorrente
						{/if}
					</span>
				</div>
			</a>

			<div class="mt-2 flex flex-wrap gap-2">
				{#if transaction.group}
					{@const isSelected = checkGroupIsSelected(transaction.group.id, filterTransactionOptions)}
					<button
						aria-label="Filtrar por grupo"
						on:click={async (e) => {
							e.preventDefault();

							if (transaction.group === null) {
								return;
							}

							if (isSelected) {
								await setFilteredTransactions({
									groupId: undefined
								});

								return;
							}

							await setFilteredTransactions({
								groupId: transaction.group.id
							});
						}}
						class="badge badge-accent"
						class:badge-outline={!isSelected}
					>
						{transaction.group.name}
					</button>
				{/if}
				{#each transaction.tags as tag}
					{@const isSelected = checkTagIsSelected(tag, filterTransactionOptions)}
					<button
						aria-label="Filtrar por tag"
						on:click={async (e) => {
							e.preventDefault();

							if (isSelected) {
								await setFilteredTransactions({
									query: '',
									queryField: 'name'
								});

								return;
							}

							await setFilteredTransactions({
								query: tag,
								queryField: 'tags'
							});
						}}
						class={classes('badge badge-primary', !isSelected && 'badge-outline')}
					>
						{tag}
					</button>
				{/each}
			</div>

			{#if i !== filteredTransactions.length - 1}
				<div class="divider my-1"></div>
			{/if}
		</li>
	{/each}
</ul>

<FloatingButton class="z-50">
	<Tooltip
		let:melt
		let:trigger
		let:content
		let:open
		let:arrow
		props={{
			openDelay: 0,
			closeDelay: 0,
			forceVisible: true,
			positioning: {
				placement: 'left'
			}
		}}
	>
		<a
			class="btn btn-circle btn-primary"
			href="/app/transactions/new"
			use:melt={trigger}
			aria-label="Criar transação"
		>
			<IconPlus class="text-2xl" />
		</a>

		{#if open}
			<div
				use:melt={content}
				transition:fade={{ duration: 100 }}
				class="z-40 rounded-box bg-base-300 p-2 shadow"
			>
				<div use:melt={arrow} />

				<p class="px-1">Criar transação</p>
			</div>
		{/if}
	</Tooltip>
</FloatingButton>
