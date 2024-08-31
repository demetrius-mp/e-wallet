<script lang="ts">
	import { createDropdownMenu, type CreateDropdownMenuProps, melt } from '@melt-ui/svelte';

	export let props: CreateDropdownMenuProps | undefined = {};

	const {
		elements: { trigger, menu, item, overlay, arrow },
		states: { open }
	} = createDropdownMenu(props);
</script>

<slot
	{melt}
	trigger={$trigger}
	arrow={$arrow}
	open={$open}
	menu={$menu}
	item={$item}
	overlay={$overlay}
/>
