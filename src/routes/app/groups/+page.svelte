<script lang="ts">
	import FloatingButton from '$lib/components/FloatingButton.svelte';
	import Tooltip from '$lib/components/UI/Tooltip.svelte';
	import { fade } from 'svelte/transition';
	import IconPlus from '~icons/mdi/Plus';

	export let data;
</script>

<svelte:head>
	<title>e-Wallet | Grupos</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Grupos</h1>
</div>

<div class="divider my-0"></div>

<ul class="mt-2">
	{#each data.groups as group}
		<li>
			<a href="/app/groups/{group.id}" class="flex rounded-xl bg-base-200 p-4 shadow-lg">
				<h2 class="text-xl font-semibold">
					{group.name}
				</h2>
			</a>
		</li>
	{/each}
</ul>

<FloatingButton class="z-50">
	<Tooltip
		let:melt
		let:trigger
		let:content
		let:open
		let:arrow
		props={{
			openDelay: 0,
			closeDelay: 0,
			forceVisible: true,
			positioning: {
				placement: 'left'
			}
		}}
	>
		<a
			class="btn btn-circle btn-primary"
			href="/app/groups/new"
			use:melt={trigger}
			aria-label="Criar grupo"
		>
			<IconPlus class="text-2xl" />
		</a>

		{#if open}
			<div
				use:melt={content}
				transition:fade={{ duration: 100 }}
				class="z-40 rounded-box bg-base-300 p-2 shadow"
			>
				<div use:melt={arrow} />

				<p class="px-1">Criar grupo</p>
			</div>
		{/if}
	</Tooltip>
</FloatingButton>
