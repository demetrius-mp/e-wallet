<script lang="ts">
	import DateField from '$lib/components/FormFields/DateField.svelte';
	import InputField from '$lib/components/FormFields/InputField.svelte';
	import NumberOfInstallmentsField from '$lib/components/FormFields/NumberOfInstallmentsField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import TagsField from '$lib/components/FormFields/TagsField.svelte';
	import ButtonForm from '$lib/components/Forms/ButtonForm.svelte';
	import type { transactionSchema } from '$lib/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<typeof transactionSchema>>;
	export let deleteAction: string | undefined = undefined;

	const { form, constraints, enhance, errors, submitting } = superForm(data);
</script>

<form use:enhance method="post" class="flex flex-col gap-4">
	<InputField
		label="Nome"
		name="name"
		bind:value={$form.name}
		{...$constraints.name}
		errors={$errors?.name}
		type="text"
		autocomplete="off"
	/>

	<InputField
		label={($form.installments || 1) > 1 ? 'Valor da parcela' : 'Valor'}
		name="value"
		bind:value={$form.value}
		{...$constraints.value}
		errors={$errors?.value}
		type="number"
		autocomplete="off"
	/>

	<DateField
		name="date"
		label="Data da compra"
		bind:value={$form.date}
		{...$constraints.date}
		errors={$errors?.date}
	/>

	{#key $form.date}
		<NumberOfInstallmentsField
			label="Parcelas restantes"
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
