<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';

	interface $$Props extends HTMLBaseAttributes {}
</script>

<div class="mt-20"></div>

<div {...$$restProps} class="floating-button-container {$$restProps.class}">
	<slot />
</div>

<style lang="postcss">
	.floating-button-container {
		@apply fixed bottom-4;
		right: calc(1rem + var(--scrollbar-width, 0px));
	}
</style>
