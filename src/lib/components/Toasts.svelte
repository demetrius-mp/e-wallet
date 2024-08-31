<script lang="ts" context="module">
	type ToastData = {
		kind: App.FlashMessageKind;
		description: string;
	};

	const {
		elements: { content, title, description, close },
		helpers: { addToast, removeToast },
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export { addToast, removeToast };

	const textColor: Record<App.FlashMessageKind, string> = {
		error: 'text-error',
		success: 'text-success',
		info: 'text-info',
		warning: 'text-warning'
	};

	const toastIcon: Record<App.FlashMessageKind, ComponentType> = {
		error: IconAlertOutline,
		success: IconCheckCircleOutline,
		info: IconInformationOutline,
		warning: IconAlertOutline
	};

	const kindTranslation: Record<App.FlashMessageKind, string> = {
		error: 'Erro',
		success: 'Sucesso',
		info: 'Informação',
		warning: 'Aviso'
	};
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte';
	import type { ComponentType } from 'svelte';
	import { flip } from 'svelte/animate';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import IconAlertOutline from '~icons/mdi/alert-outline';
	import IconCheckCircleOutline from '~icons/mdi/check-circle-outline';
	import IconCloseCircleOutline from '~icons/mdi/close-circle-outline';
	import IconInformationOutline from '~icons/mdi/information-outline';

	interface $$Props extends HTMLBaseAttributes {}
</script>

<div
	class="fixed bottom-0 right-0 z-[99] m-4 flex flex-col items-end gap-2 {$$restProps.class}"
	use:portal
>
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="max-w-xs rounded-md border border-gray-700 bg-base-200"
		>
			<div class="flex items-center justify-between pe-1 ps-2 pt-1">
				<div class="flex gap-2">
					<svelte:component
						this={toastIcon[data.kind]}
						class="h-6 w-6 text-2xl {textColor[data.kind]}"
					/>
					<h3 use:melt={$title(id)} class="font-bold">
						{kindTranslation[data.kind]}
					</h3>
				</div>

				<button use:melt={$close(id)} class="btn btn-circle btn-ghost btn-sm">
					<svelte:component this={IconCloseCircleOutline} class="h-6 w-6" />
				</button>
			</div>
			<div class="divider m-0"></div>
			<p use:melt={$description(id)} class="px-3 pb-2">
				{data.description}
			</p>
		</div>
	{/each}
</div>
