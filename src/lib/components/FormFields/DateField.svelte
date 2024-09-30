<script lang="ts">
	import { date } from '$lib/utils/date';

	import type { HTMLInputAttributes } from 'svelte/elements';

	interface $$Props extends HTMLInputAttributes {
		required?: boolean;
		value?: string;
		errors?: string[];
		showButtons?: boolean;
		label: string;
		name: string;
	}

	export let required: boolean = false;
	export let value: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let label: string;

	function handleMinusClick() {
		const valueAsDate = date.utc(value, 'DD/MM/YY', true);

		if (valueAsDate.isValid()) {
			value = valueAsDate.subtract(1, 'day').format('DD/MM/YY');
		} else {
			value = date.utc().subtract(1, 'day').format('DD/MM/YY');
		}
	}

	function handlePlusClick() {
		const valueAsDate = date.utc(value, 'DD/MM/YY', true);

		if (valueAsDate.isValid()) {
			value = valueAsDate.add(1, 'day').format('DD/MM/YY');
		} else {
			value = date.utc().add(1, 'day').format('DD/MM/YY');
		}
	}

	$: error = errors?.at(0);
	$: hasError = Boolean(error);
</script>

<label class="form-control w-full">
	<div class="label flex-wrap gap-2">
		<span class="label-text">
			{label}
			{#if required}
				<span class="text-error"> * </span>
			{/if}
			<small class="text-xs"> (dd/mm/aa) </small>
		</span>
	</div>
	<div class="join">
		<input
			{...$$restProps}
			{required}
			bind:value
			class="input join-item input-bordered w-full"
			class:input-error={hasError}
			aria-invalid={hasError}
			inputmode="decimal"
		/>
		<button type="button" on:click={handleMinusClick} class="btn join-item"> - </button>
		<button type="button" on:click={handlePlusClick} class="btn join-item"> + </button>
	</div>
	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</label>
