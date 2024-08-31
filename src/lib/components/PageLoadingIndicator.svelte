<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	export const showPageLoadingIndicatorStore = writable(false);
</script>

{#if $showPageLoadingIndicatorStore}
	<div class="loading-container">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{/if}

<style lang="postcss">
	.loading-container {
		@apply fixed z-[999] m-auto h-8 w-8 overflow-visible;
		@apply bottom-0 left-0 right-0 top-0;
	}

	.loading-container:before {
		@apply fixed left-0 top-0 block h-full w-full bg-base-100/50;
		content: '';
	}
</style>
