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

	let searchTransactionsQuery = '';
	let selectedDate = date().utc(true).add(1, 'month').format('MM/YYYY');
	let highlightedDate = selectedDate;

	let filteredTransactions = data.transactions;
	$: bill = filteredTransactions.reduce((acc, transaction) => acc + transaction.value, 0);

	console.log(date.utc(data.transactions[0].date).format());
	console.log(date.utc(data.transactions[0].endsAt).format());
</script>

<svelte:head>
	<title>e-Wallet | Transações</title>
</svelte:head>

<div>
	<div class="flex items-baseline gap-2">
		<h2 class="text-2xl">Fatura</h2>
		<small> ({selectedDate}) </small>
	</div>

	<Currency class="text-4xl font-extrabold" value={bill} />
</div>

<div class="divider my-1"></div>

<div class="flex items-center justify-between gap-2">
	<div>
		<h2 class="text-2xl">À vencer</h2>
		<span class="text-sm">
			no mês {selectedDate}
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
						Mês selecionado: {selectedDate}
					</span>

					<div class="divider my-0 mb-2"></div>

					<MonthCalendar
						min={data.minDate}
						max={data.maxDate}
						{highlightedDate}
						bind:selectedDate
						onChange={(date) => {
							filteredTransactions = filterTransactions({
								date,
								transactions: data.transactions,
								query: searchTransactionsQuery
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
				date: selectedDate,
				transactions: data.transactions,
				query: searchTransactionsQuery
			});
		}}
		class="join w-full"
	>
		<input
			name="query"
			bind:value={searchTransactionsQuery}
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
								date(selectedDate, 'MM/YYYY').utc(true).toDate()
							)}

							{paidInstallments}/{numberOfInstallments}
						{/if}
					{:else}
						Recorrente
					{/if}
				</span>
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
