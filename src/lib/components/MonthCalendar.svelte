<script lang="ts" context="module">
	const months = [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro'
	];
</script>

<script lang="ts">
	import { classes } from '$lib/utils/classes';
	import { date } from '$lib/utils/date';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import IconChevronLeft from '~icons/mdi/ChevronLeft';
	import IconChevronRight from '~icons/mdi/ChevronRight';

	interface $$Props extends HTMLBaseAttributes {
		min: string;
		max: string;
		selectedDate: string;
		highlightedDate: string;
		onChange?: (date: string) => void;
	}

	export let min: string;
	export let max: string;
	export let selectedDate: string;
	export let highlightedDate: string;
	export let onChange: $$Props['onChange'] = undefined;

	$: minDate = date(min, 'MM/YYYY').utc(true);
	$: maxDate = date(max, 'MM/YYYY').utc(true);
	$: minYear = minDate.year();
	$: maxYear = maxDate.year();

	let [displayedMonth, displayedYear] = selectedDate.split('/').map((v) => parseInt(v, 10));

	function toDateString(year: number, month: number) {
		return `${month.toString().padStart(2, '0')}/${year}`;
	}

	function setSelectedDate(year: number, month: number) {
		displayedYear = year;
		displayedMonth = month;

		selectedDate = toDateString(year, month);

		onChange?.(selectedDate);
	}

	function checkMonthIsDisabled(year: number, month: number) {
		const d = date(toDateString(year, month), 'MM/YYYY').utc(true);

		return d.isBefore(minDate) || d.isAfter(maxDate);
	}

	function checkMonthIsSelected(year: number, month: number) {
		const [selectedMonth, selectedYear] = selectedDate.split('/').map((v) => parseInt(v, 10));

		return selectedMonth === month && selectedYear === year;
	}

	function checkMonthIsHighlightedDate(year: number, month: number) {
		return highlightedDate === toDateString(year, month);
	}
</script>

<div {...$$restProps} class={$$restProps.class}>
	<div class="flex items-center justify-between">
		<button
			disabled={displayedYear === minYear}
			on:click={() => (displayedYear -= 1)}
			class="btn btn-neutral btn-sm"
			aria-label="Diminuir ano"
		>
			<IconChevronLeft />
		</button>

		<span class="text-2xl"> {displayedYear} </span>

		<button
			disabled={displayedYear === maxYear}
			on:click={() => (displayedYear += 1)}
			class="btn btn-neutral btn-sm"
			aria-label="Aumentar ano"
		>
			<IconChevronRight />
		</button>
	</div>

	<div class="mt-4 grid grid-cols-4 gap-4">
		{#each months as monthName, i}
			{@const month = i + 1}
			{@const isDisabled = checkMonthIsDisabled(displayedYear, month)}
			{@const isSelected = checkMonthIsSelected(displayedYear, month)}
			{@const isHighlighted = checkMonthIsHighlightedDate(displayedYear, month)}
			{#key displayedMonth}
				<button
					on:click={() => setSelectedDate(displayedYear, month)}
					aria-label={`Selectionar mês ${monthName}`}
					disabled={isDisabled}
					class={classes(
						'btn animate-none uppercase hover:btn-primary',
						isSelected && 'btn-primary',
						isHighlighted && !isSelected && 'btn-outline btn-primary'
					)}
				>
					{monthName.substring(0, 3)}
				</button>
			{/key}
		{/each}
	</div>
</div>
