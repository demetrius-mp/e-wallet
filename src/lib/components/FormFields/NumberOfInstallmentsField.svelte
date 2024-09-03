<script lang="ts">
	import { date } from '$lib/utils/date';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import IconCashSync from '~icons/mdi/CashSync';

	interface $$Props extends Omit<HTMLInputAttributes, 'type' | 'value'> {
		label: string;
		required?: boolean;
		installments?: number | null;
		errors?: string[];
		endsAt?: string;
		name: string;
		initialDate: string;
	}

	export let label: string;
	export let required: boolean = false;
	export let installments: number | null | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let endsAt: string = 'Recorrente';
	export let initialDate: string;

	function onRecurrentClick() {
		installments = null;
		endsAt = 'Recorrente';
	}

	function onMinusClick() {
		installments = (installments || 0) - 1;
		endsAt = date.utc(initialDate, 'DD/MM/YY').add(installments, 'months').format('MM/YY');
	}

	function onPlusClick() {
		installments = (installments || 0) + 1;
		endsAt = date.utc(initialDate, 'DD/MM/YY').add(installments, 'months').format('MM/YY');
	}

	function isNextMonth(d: string) {
		const today = date.utc(initialDate, 'DD/MM/YY').startOf('month');
		const diff = date.utc(d, 'MM/YY').diff(today, 'month');

		return diff === 1;
	}

	function calculateEndsAt(installments: number, initialDate: string) {
		return date.utc(initialDate, 'DD/MM/YY').add(installments, 'months').format('MM/YY');
	}

	$: endsAt = installments ? calculateEndsAt(installments, initialDate) : 'Recorrente';

	$: error = errors?.at(0);
	$: hasError = Boolean(error);
</script>

<label class="form-control">
	<div class="label">
		<span class="label-text">
			{label}
			{#if required}
				<span class="text-error"> * </span>
			{/if}
			<small class="text-xs">
				{#if endsAt === 'Recorrente'}
					(Recorrente)
				{:else if isNextMonth(endsAt)}
					(À vista, {endsAt})
				{:else}
					({endsAt})
				{/if}
			</small>
		</span>
	</div>

	<div class="join">
		<input
			type="number"
			readonly
			{...$$restProps}
			{required}
			bind:value={installments}
			aria-invalid={hasError}
			class:input-error={hasError}
			class="input join-item input-bordered inline-flex w-full"
		/>

		<button on:click={onRecurrentClick} type="button" class="btn join-item">
			<IconCashSync />
		</button>
		<button on:click={onMinusClick} type="button" class="btn join-item"> - </button>
		<button on:click={onPlusClick} type="button" class="btn join-item"> + </button>
	</div>

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</label>
