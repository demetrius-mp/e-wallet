<script lang="ts">
	import { createPopover, melt, type CreatePopoverProps } from '@melt-ui/svelte';

	export let props: CreatePopoverProps | undefined = {};

	const {
		elements: { trigger, content, arrow, close, overlay },
		states: { open }
	} = createPopover(props);
</script>

<slot
	{melt}
	trigger={$trigger}
	arrow={$arrow}
	open={$open}
	content={$content}
	close={$close}
	overlay={$overlay}
/>
