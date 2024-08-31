<script lang="ts" context="module">
	import type { ComponentType } from 'svelte';
	import IconAlertOutline from '~icons/mdi/AlertOutline';
	import IconCheckCircleOutline from '~icons/mdi/CheckCircleOutline';
	import IconCloseCircleOutline from '~icons/mdi/CloseCircleOutline';
	import IconInformationOutline from '~icons/mdi/InformationOutline';

	const alertIcons: Record<App.FlashMessageKind, ComponentType> = {
		info: IconInformationOutline,
		success: IconCheckCircleOutline,
		warning: IconAlertOutline,
		error: IconCloseCircleOutline
	};

	function getAlertIcon(kind: App.FlashMessageKind): ComponentType {
		return alertIcons[kind];
	}
</script>

<script lang="ts">
	export let kind: App.FlashMessageKind;
</script>

<div role="alert" class="alert flex items-center gap-3 rounded-box bg-error p-4 text-error-content">
	<svelte:component this={getAlertIcon(kind)} class="text-xl" />

	<span>
		<slot />
	</span>
</div>
