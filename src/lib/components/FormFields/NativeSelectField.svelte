<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface $$Props extends HTMLSelectAttributes {
		label: string;
		required?: boolean;
		value?: string | number | null;
		errors?: string[];
		name: string;
	}

	export let label: string;
	export let required: boolean = false;
	export let value: string | number | null = null;
	export let errors: string[] | undefined = undefined;

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
		</span>
	</div>

	<select
		{...$$restProps}
		{required}
		bind:value
		aria-invalid={hasError}
		class:select-error={hasError}
		class="select select-bordered {$$restProps.class}"
	>
		<slot />
	</select>

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</label>
