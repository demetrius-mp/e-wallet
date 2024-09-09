<script lang="ts" context="module">
	function split(value?: string) {
		if (!value) return undefined;

		const splitted = value.trim().split(',');

		if (splitted.length === 0) return undefined;

		return splitted;
	}
</script>

<script lang="ts">
	import { joinBy } from '$lib/utils/joinBy';

	import { createTagsInput, melt, type CreateTagsInputProps } from '@melt-ui/svelte';
	import IconClose from '~icons/mdi/Close';

	export let value: string | undefined = undefined;
	export let errors: string[] | undefined = [];
	export let placeholder: string | undefined = undefined;
	export let label: string;
	export let name: string;
	export let props: Omit<CreateTagsInputProps, 'defaultTags'> = {};

	$: error = errors?.at(0);
	$: hasError = Boolean(error);

	const {
		elements: { root, input, tag, deleteTrigger, edit },
		states: { tags }
	} = createTagsInput({
		...props,
		defaultTags: split(value),
		onTagsChange: ({ next }) => {
			value = joinBy(next, (t) => t.value, ',');

			return next;
		}
	});

	$: {
		if (!value) {
			$tags = [];
		}
	}
</script>

<div>
	<div class="label">
		<span class="label-text">
			{label}
		</span>
	</div>
	<div
		use:melt={$root}
		aria-invalid={hasError}
		class:input-error={hasError}
		class="input input-bordered flex h-auto min-h-12 flex-row flex-wrap gap-2 border py-1.5 pl-2"
		class:pl-4={$tags.length === 0}
	>
		{#each $tags as t}
			<div
				use:melt={$tag(t)}
				class="flex items-center overflow-hidden rounded-md bg-base-200 p-1 [word-break:break-word] data-[selected]:bg-base-300"
			>
				<span class="flex items-center border-r border-base-100 px-1.5">{t.value}</span>
				<button type="button" use:melt={$deleteTrigger(t)} class="flex h-full items-center px-1">
					<IconClose class="size-3" />
				</button>
			</div>
			<div
				use:melt={$edit(t)}
				class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-error"
			/>
		{/each}

		<input type="hidden" {name} value={value || ''} />

		<input
			enterkeyhint="enter"
			on:keypress={(e) => e.key === ',' && e.preventDefault()}
			name="tags-input--{name}"
			use:melt={$input}
			type="text"
			{placeholder}
			class="min-w-[4.5rem] shrink grow basis-0 border-0 bg-transparent outline-none focus:!ring-0 data-[invalid]:text-error"
			class:pl-2={$tags.length > 0}
		/>
	</div>

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">
				{error}
			</span>
		</div>
	{/if}
</div>
