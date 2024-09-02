<script lang="ts" generics="TItem, TValue extends string | number">
	import {
		createSelect,
		melt,
		type CreateSelectProps,
		type SelectOptionProps
	} from '@melt-ui/svelte';

	export let items: readonly TItem[];
	export let toValue: (item: TItem) => TValue;
	export let toLabel: (item: TItem) => string;
	export let initialSelected: TItem | undefined;
	export let value: TValue | undefined = undefined;
	export let onChange: ((item: TItem | undefined) => void) | undefined = undefined;
	export let required = false;
	export let label: string;
	export let name: string;
	export let errors: string[] | undefined = undefined;
	export let props:
		| Omit<CreateSelectProps<TItem>, 'defaultSelected' | 'required' | 'onSelectedChange'>
		| undefined = {};

	function toOption(item: TItem): SelectOptionProps<TItem> {
		return {
			value: item,
			label: toLabel(item)
		};
	}

	const {
		elements: { trigger, menu, option, label: meltLabel },
		states: { open, selected }
	} = createSelect<TItem>({
		...props,
		defaultSelected: initialSelected ? toOption(initialSelected) : undefined,
		required,
		onSelectedChange(data) {
			if (data.next) {
				value = toValue(data.next?.value);
				onChange?.(data.next?.value);
			}

			return data.next;
		}
	});

	$: value = $selected ? toValue($selected.value) : undefined;

	$: error = errors?.at(0);
	$: hasError = Boolean(error);
</script>

<div class="flex w-full flex-col">
	<div class="label">
		<span class="label-text">
			<!-- svelte-ignore a11y-label-has-associated-control - $meltLabel contains the 'for' attribute -->
			<label use:melt={$meltLabel}>
				{label}
			</label>
			{#if required}
				<span class="text-error"> * </span>
			{/if}
		</span>
	</div>
	<div class="join w-full">
		<!-- svelte-ignore a11y-role-supports-aria-props - $trigger should do the work -->
		<button
			type="button"
			class="input input-bordered flex w-full items-center justify-between truncate"
			class:join-item={!required}
			use:melt={$trigger}
			aria-label={label}
			aria-invalid={hasError}
			class:input-error={hasError}
		>
			<slot name="trigger-content" selected={$selected} />
		</button>

		{#if !required}
			<button type="button" on:click={() => ($selected = undefined)} class="btn join-item">
				Remover
			</button>
		{/if}
	</div>

	{#if $open}
		<slot
			name="menu"
			{melt}
			menu={$menu}
			{items}
			option={$option}
			{toOption}
			selected={$selected}
		/>
	{/if}

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</div>

<input type="hidden" {name} value={$selected ? toValue($selected.value) : ''} />
