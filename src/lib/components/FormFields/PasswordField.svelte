<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import IconEye from '~icons/mdi/eye';
	import IconEyeOff from '~icons/mdi/eye-off';

	interface $$Props extends Omit<HTMLInputAttributes, 'type'> {
		label: string;
		required?: boolean;
		value?: string | number | null;
		errors?: string[];
		name: string;
		autocomplete?: 'new-password' | 'current-password';
		invalid?: boolean;
	}

	export let label: string;
	export let required: boolean = false;
	export let value: string | number | null = null;
	export let errors: string[] | undefined = undefined;
	export let autocomplete: 'new-password' | 'current-password' | undefined = undefined;
	export let invalid = false;

	let showPassword = false;

	$: error = errors?.at(0);
	$: hasError = invalid || Boolean(error);
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

	<div class="join">
		<input
			{...$$restProps}
			type={showPassword ? 'text' : 'password'}
			{required}
			{value}
			{autocomplete}
			on:change={(e) => (value = e.currentTarget.value)}
			aria-invalid={hasError}
			class:input-error={hasError}
			class="input join-item input-bordered inline-flex w-full"
		/>

		<button on:click={() => (showPassword = !showPassword)} type="button" class="btn join-item">
			{#if showPassword}
				<IconEyeOff />
			{:else}
				<IconEye />
			{/if}
		</button>
	</div>

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</label>
