<script lang="ts" generics="TItem, TValue">
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import debounce from 'lodash/debounce';
	import { fly } from 'svelte/transition';

	export let items: TItem[];
	export let toItemLabel: (item: TItem) => string;
	export let toItemValue: (item: TItem) => TValue;
	export let fetchItems: (query: string) => Promise<TItem[]>;
	export let label: string;
	export let initialSelected: TItem | undefined;
	export let value: TValue | undefined = undefined;
	export let onChange: ((item: TItem) => void) | undefined = undefined;
	export let required: boolean = false;
	export let name: string;
	export let errors: string[] | undefined = [];
	export let invalid = false;

	function toOption(item: TItem): ComboboxOptionProps<TItem> {
		return {
			value: item,
			label: toItemLabel(item)
		};
	}

	function checkHasSelectedItem(items: TItem[]) {
		return items.some((item) => toItemValue(item) === value);
	}

	let filteredOptions: TItem[] = items;
	let isFiltering = false;
	function filterOptions(query: string) {
		isFiltering = true;
		fetchItems(query)
			.then((fetchedItems) => {
				const hasSelectedItem = checkHasSelectedItem(fetchedItems);

				if (!hasSelectedItem && $meltSelected?.value) {
					fetchedItems.unshift($meltSelected.value);
				}

				filteredOptions = fetchedItems;

				const firstOption = htmlUlElement?.firstElementChild;

				if (firstOption) {
					$highlightedItem?.removeAttribute('data-highlighted');
					firstOption.setAttribute('data-highlighted', '');

					highlightedItem.set(firstOption as HTMLElement);
				}
			})
			.finally(() => {
				isFiltering = false;
			});
	}

	const {
		elements: { menu, input, option, hiddenInput, label: meltLabel },
		states: { open, inputValue, touchedInput, selected: meltSelected, highlightedItem }
	} = createCombobox<TItem>({
		forceVisible: true,
		name,
		required,
		defaultSelected: initialSelected && toOption(initialSelected),
		onSelectedChange(data) {
			if (data.next) {
				value = toItemValue(data.next.value);
				onChange?.(data.next.value);
			}

			return data.next;
		}
	});

	let htmlUlElement: HTMLUListElement | null = null;

	$: if (!$open) {
		$inputValue = $meltSelected?.label ?? '';
	}

	const debouncedFilterOptions = debounce(filterOptions, 500);
	$: $touchedInput && debouncedFilterOptions($inputValue);

	$: error = errors?.at(0);
	$: hasError = invalid || Boolean(error);

	function checkIsSelected(item: TItem, selected?: TItem) {
		if (!selected) return false;

		return toItemValue(item) === toItemValue(selected);
	}
</script>

<div>
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="label" use:melt={$meltLabel}>
		<span class="label-text">
			{label}
			{#if required}
				<span class="text-error">*</span>
			{/if}
		</span>
	</label>

	<div class="relative w-full" class:join={!required}>
		<input
			use:melt={$input}
			class="input input-bordered w-full"
			class:join-item={!required}
			aria-invalid={hasError}
			class:input-error={hasError}
		/>
		{#if isFiltering}
			<div class:right-28={!required} class="absolute right-4 top-3.5 z-10">
				<span class="loading loading-spinner loading-xs"></span>
			</div>
		{/if}
		{#if !required}
			<button
				on:click={() => {
					$meltSelected = undefined;
					value = undefined;
				}}
				type="button"
				class="btn join-item"
			>
				Remover
			</button>
		{/if}
	</div>

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</div>
{#if $open}
	<ul
		bind:this={htmlUlElement}
		class="combobox-menu"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		{#each filteredOptions as opt}
			{@const isSelected = checkIsSelected(opt, $meltSelected?.value)}
			<li
				use:melt={$option({
					...toOption(opt),
					disabled: isFiltering
				})}
				class="combobox-option"
				class:combobox-option-loading={isFiltering}
				class:combobox-option-selected={isSelected}
			>
				<slot name="item" item={opt} {isSelected} />
			</li>
		{/each}
	</ul>
{/if}

<input {name} type="hidden" value={$meltSelected ? toItemValue($meltSelected.value) : ''} />

<style lang="postcss">
	.combobox-menu {
		@apply z-[999] flex flex-col gap-1 rounded-box bg-base-300 p-2;
		@apply max-h-[15rem] overflow-y-auto;
	}

	.combobox-option {
		@apply z-[999];
		@apply rounded-lg data-[highlighted]:bg-base-content/5;
	}

	.combobox-option-loading {
		@apply !animate-pulse;
	}

	.combobox-option-selected {
		@apply bg-base-content/10;
	}
</style>
