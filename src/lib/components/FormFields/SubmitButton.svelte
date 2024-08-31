<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		submitting?: boolean;
		disabled?: boolean;
	}

	export let submitting = false;
	export let disabled = false;
</script>

<button type="submit" {...$$restProps} disabled={submitting || disabled}>
	{#if submitting}
		<span class="loading loading-spinner loading-xs"></span>
	{:else}
		<slot name="icon" />
	{/if}
	<slot />
</button>
