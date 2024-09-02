<script lang="ts">
	import Currency from '$lib/components/Currency.svelte';
	import FloatingButton from '$lib/components/FloatingButton.svelte';
	import MonthCalendar from '$lib/components/MonthCalendar.svelte';
	import Popover from '$lib/components/UI/Popover.svelte';
	import Tooltip from '$lib/components/UI/Tooltip.svelte';
	import { filterTransactions } from '$lib/models/transaction.js';
	import { date, getDatesDiffInMonths } from '$lib/utils/date.js';
	import { fade } from 'svelte/transition';
	import IconCalendarMonth from '~icons/mdi/CalendarMonth';
	import IconClose from '~icons/mdi/Close';
	import IconMagnify from '~icons/mdi/Magnify';
	import IconPlus from '~icons/mdi/Plus';

	export let data;

	type FilterTransactionOpions = {
		date: string;
		query: string;
		queryField: 'name' | 'tags';
	};

	let filterTransactionOptions: FilterTransactionOpions = {
		date: date().utc(true).add(1, 'month').format('MM/YYYY'),
		query: '',
		queryField: 'name'
	};

	let highlightedDate = filterTransactionOptions.date;

	let filteredTransactions = filterTransactions({
		...filterTransactionOptions,
		transactions: data.transactions
	});

	$: bill = filteredTransactions.reduce((acc, transaction) => acc + transaction.value, 0);

	function checkShouldHighlightTag(tag: string, filterTransactionOptions: FilterTransactionOpions) {
		if (filterTransactionOptions.queryField === 'tags') {
			return tag == filterTransactionOptions.query;
		}

		return false;
	}
</script>

<svelte:head>
	<title>e-Wallet | Transações</title>
</svelte:head>

<div>
	<div class="flex items-baseline gap-2">
		<h2 class="text-2xl">Fatura</h2>
		<small> ({filterTransactionOptions.date}) </small>
	</div>

	<Currency class="text-4xl font-extrabold" value={bill} />
</div>

<div class="divider my-1"></div>

<div class="flex items-center justify-between gap-2">
	<div>
		<h2 class="text-2xl">À vencer</h2>
		<span class="text-sm">
			no mês {filterTransactionOptions.date}
		</span>
	</div>

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
				placement: 'bottom-start'
			}
		}}
	>
		<button use:melt={trigger} aria-label="Abrir calendário" class="btn btn-circle btn-neutral">
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
						bind:selectedDate={filterTransactionOptions.date}
						onChange={(date) => {
							filteredTransactions = filterTransactions({
								date,
								transactions: data.transactions,
								query: filterTransactionOptions.query,
								queryField: filterTransactionOptions.queryField
							});
						}}
					/>
				</div>
			</div>
		{/if}
	</Popover>
</div>

<div class="mt-4">
	<form
		on:submit={(e) => {
			e.preventDefault();
			filteredTransactions = filterTransactions({
				transactions: data.transactions,
				...filterTransactionOptions
			});
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
					<span class="text-lg font-bold">
						{transaction.name}
					</span>

					<span class="text-lg">
						<Currency value={transaction.value} />
					</span>
				</div>

				<div class="flex justify-between">
					<span class="text-sm">
						{date.utc(transaction.date).format('DD/MM/YY')}
					</span>

					<span class="text-nowrap text-sm">
						{#if transaction.endsAt !== null}
							{@const numberOfInstallments = getDatesDiffInMonths(
								transaction.date,
								transaction.endsAt
							)}
							{#if numberOfInstallments === 1}
								À vista
							{:else}
								{@const paidInstallments = getDatesDiffInMonths(
									transaction.date,
									date(filterTransactionOptions.date, 'MM/YYYY').utc(true).toDate()
								)}

								{paidInstallments}/{numberOfInstallments}
							{/if}
						{:else}
							Recorrente
						{/if}
					</span>
				</div>

				{#if transaction.tags.length > 0}
					<div class="mt-2 flex flex-wrap gap-2">
						{#each transaction.tags as tag}
							<div
								class="badge badge-neutral"
								class:badge-primary={checkShouldHighlightTag(tag, filterTransactionOptions)}
							>
								{tag}
							</div>
						{/each}
					</div>
				{/if}

				{#if i !== filteredTransactions.length - 1}
					<div class="divider my-1"></div>
				{/if}
			</a>
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
