<script lang="ts">
	import SelectField from '$lib/components/FormFields/SelectField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import { date } from '$lib/utils/date.js';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import IconCheck from '~icons/mdi/Check';
	import IconChevronDown from '~icons/mdi/ChevronDown';

	export let data;

	const { form, errors, submitting, enhance } = superForm(data.form);

	function getDateWithTimezone(tz: string) {
		return date.tz(new Date(), tz).format('DD/MM/YYYY HH:mm:ss');
	}
</script>

<svelte:head>
	<title>e-Wallet - Alterar fuso horário</title>
</svelte:head>

<h1 class="text-2xl">Alterar fuso horário</h1>

<div class="divider my-0"></div>

<form class="flex flex-col gap-4" use:enhance method="post">
	<SelectField
		label="Fuso horário ({getDateWithTimezone($form.timezone)})"
		name="timezone"
		items={Intl.supportedValuesOf('timeZone')}
		toValue={(item) => item}
		toLabel={(item) => item}
		initialSelected={$form.timezone}
		required
		bind:value={$form.timezone}
		errors={$errors.timezone}
		props={{
			forceVisible: true
		}}
	>
		<svelte:fragment slot="trigger-content" let:selected>
			{#if selected}
				<span>
					{selected.value}
				</span>
			{/if}

			<IconChevronDown class="text-xl" />
		</svelte:fragment>

		<svelte:fragment slot="menu" let:melt let:items let:toOption let:option let:selected let:menu>
			<div
				class="flex max-h-[14.5rem] flex-col gap-1 overflow-y-auto rounded-box bg-base-200 p-2"
				use:melt={menu}
				transition:slide={{ duration: 80 }}
			>
				{#each items as item}
					<div
						use:melt={option(toOption(item))}
						class="z-50 flex w-full select-none flex-col gap-2 rounded-lg p-2 data-[highlighted]:bg-base-content/5"
					>
						<span class="flex items-center gap-2">
							{item}
							{#if selected?.value === item}
								<IconCheck />
							{/if}
						</span>

						<span>
							{getDateWithTimezone(item)}
						</span>
					</div>
				{/each}
			</div>
		</svelte:fragment>
	</SelectField>

	<div class="flex justify-end">
		<SubmitButton class="btn btn-primary" submitting={$submitting}>Alterar</SubmitButton>
	</div>
</form>
