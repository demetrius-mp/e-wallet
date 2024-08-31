<script lang="ts">
	import type { HTMLInputAutocompleteAttribute } from '$lib/utils/types';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface $$Props extends HTMLInputAttributes {
		errors?: string[];
		label: string;
		name: string;
		autocomplete: HTMLInputAutocompleteAttribute;
		invalid?: boolean;
	}

	export let value: string | number | undefined = undefined;
	export let errors: string[] | undefined = [];
	export let label: string;
	export let name: string;
	export let invalid = false;

	$: error = errors?.at(0);
	$: hasError = invalid || Boolean(error);
</script>

<label class="form-control">
	<div class="label">
		<span class="label-text">
			{label}
			{#if $$restProps.required}
				<span class="text-error">*</span>
			{/if}
		</span>
	</div>
	<input
		{...$$restProps}
		bind:value
		{name}
		aria-invalid={hasError}
		class:input-error={hasError}
		class="input input-bordered {$$restProps.class}"
	/>
	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</label>
