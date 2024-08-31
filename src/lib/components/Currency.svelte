<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';

	function createShowCurrencyStore() {
		const { subscribe, set, update } = writable(true);

		return {
			subscribe,
			show: () => set(true),
			hide: () => set(false),
			toggle: () => update((state) => !state)
		};
	}

	export const showCurrency = createShowCurrencyStore();

	const numberOfInstances = writable(0);

	export const pageHasCurrency = derived(numberOfInstances, ($numberOfUses) => $numberOfUses > 0);
</script>

<script lang="ts">
	import { formatCurrency } from '$lib/utils/formatCurrency';
	import { onMount } from 'svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';

	interface $$Props extends HTMLBaseAttributes {
		value: number;
	}

	$: show = $showCurrency;

	export let value: number;

	$: formattedValue = formatCurrency(value);

	let spanElement: HTMLSpanElement;

	function updateWidthAndHeight(content: string) {
		const ruler = document.createElement('div');
		ruler.style.width = 'auto';
		ruler.style.height = 'auto';
		ruler.style.position = 'absolute';
		ruler.style.whiteSpace = 'nowrap';
		ruler.style.visibility = 'hidden';

		if (content) {
			ruler.textContent = content;
		}

		spanElement.appendChild(ruler);

		const height = ruler.clientHeight + 'px';
		const width = ruler.clientWidth + 'px';

		ruler.remove();

		spanElement.style.setProperty('--skeleton-width', width);
		spanElement.style.setProperty('--skeleton-height', height);
	}

	$: if (formattedValue && spanElement) updateWidthAndHeight(formattedValue);

	onMount(() => {
		$numberOfInstances += 1;

		return () => {
			$numberOfInstances -= 1;
		};
	});
</script>

<span bind:this={spanElement} class:skeleton={!show} {...$$restProps}>
	{#if show}
		{formattedValue}
	{:else}
		<span class="sr-only"> Informação escondida </span>
	{/if}
</span>

<style lang="postcss">
	span.skeleton {
		height: var(--skeleton-height);
		width: var(--skeleton-width);
		@apply block animate-none rounded-md;
	}
</style>
