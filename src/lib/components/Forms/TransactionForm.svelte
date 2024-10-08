<script lang="ts">
	import ComboboxField from '$lib/components/FormFields/ComboboxField.svelte';
	import DateField from '$lib/components/FormFields/DateField.svelte';
	import InputField from '$lib/components/FormFields/InputField.svelte';
	import NativeSelectField from '$lib/components/FormFields/NativeSelectField.svelte';
	import NumberOfInstallmentsField from '$lib/components/FormFields/NumberOfInstallmentsField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import TagsField from '$lib/components/FormFields/TagsField.svelte';
	import ButtonForm from '$lib/components/Forms/ButtonForm.svelte';
	import { fetchGroups } from '$lib/models/group';
	import type { transactionSchema } from '$lib/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import IconCheck from '~icons/mdi/Check';

	export let data: SuperValidated<Infer<typeof transactionSchema>>;
	export let deleteAction: string | undefined = undefined;
	export let groups: { id: number; name: string }[];

	const { form, constraints, enhance, errors, submitting } = superForm(data);

	let initialSelectedGroup = groups.find((group) => group.id === $form.groupId);
</script>

<form use:enhance method="post" class="flex flex-col gap-4">
	<InputField
		autofocus
		label="Nome"
		name="name"
		bind:value={$form.name}
		{...$constraints.name}
		errors={$errors?.name}
		type="text"
		autocomplete="off"
	/>

	<div class="grid grid-cols-2 gap-2">
		<div class="col-span-1">
			<InputField
				label={($form.installments || 1) > 1 ? 'Valor da parcela' : 'Valor'}
				name="value"
				bind:value={$form.value}
				{...$constraints.value}
				errors={$errors?.value}
				type="number"
				autocomplete="off"
			/>
		</div>

		<div class="col-span-1">
			<NativeSelectField
				label="Tipo"
				name="type"
				bind:value={$form.type}
				{...$constraints.type}
				errors={$errors?.type}
			>
				<option value="EXPENSE">Despesa</option>
				<option value="INCOME">Receita</option>
			</NativeSelectField>
		</div>
	</div>

	<DateField
		name="date"
		label="Data da compra"
		bind:value={$form.date}
		{...$constraints.date}
		errors={$errors?.date}
	/>

	{#key $form.date}
		<NumberOfInstallmentsField
			label="Parcelas"
			name="installments"
			initialDate={$form.date}
			bind:installments={$form.installments}
			bind:endsAt={$form.endsAt}
		/>
	{/key}

	<input type="hidden" name="endsAt" value={$form.endsAt} />

	<TagsField
		name="tags"
		label="Tags (até 5)"
		bind:value={$form.tags}
		errors={$errors?.tags}
		props={{
			unique: true,
			maxTags: 5,
			add: (tag) => tag.trim()
		}}
	/>

	<ComboboxField
		label="Grupo"
		name="groupId"
		errors={$errors?.groupId}
		items={groups}
		bind:value={$form.groupId}
		toItemLabel={(group) => group.name}
		toItemValue={(group) => group.id}
		fetchItems={fetchGroups}
		initialSelected={initialSelectedGroup}
	>
		<div class="flex w-full select-none items-center gap-2 p-2" slot="item" let:isSelected let:item>
			<span>
				{item.name}
			</span>
			{#if isSelected}
				<IconCheck />
			{/if}
		</div>

		<div class="flex w-full select-none justify-center gap-2 p-2" slot="no-items-found">
			Nenhum resultado encontrado
		</div>
	</ComboboxField>

	<div class="flex justify-end gap-2" class:justify-between={deleteAction}>
		{#if deleteAction}
			<ButtonForm action={deleteAction} confirmation="Tem certeza que quer excluir?" let:submitting>
				<SubmitButton {submitting} class="btn btn-outline btn-error">Excluir</SubmitButton>
			</ButtonForm>
		{:else}
			<input
				name="saveAndContinue"
				type="submit"
				class="btn btn-outline btn-primary"
				value="Salvar e continuar"
			/>
		{/if}

		<SubmitButton submitting={$submitting} class="btn btn-primary">Salvar</SubmitButton>
	</div>
</form>
