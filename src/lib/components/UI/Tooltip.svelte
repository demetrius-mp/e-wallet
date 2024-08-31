<script lang="ts">
	import { createTooltip, melt, type CreateTooltipProps } from '@melt-ui/svelte';

	export let props: CreateTooltipProps = {};

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip(props);
</script>

<slot {melt} trigger={$trigger} content={$content} arrow={$arrow} open={$open} />
