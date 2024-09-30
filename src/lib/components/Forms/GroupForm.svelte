<script lang="ts">
	import InputField from '$lib/components/FormFields/InputField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import ButtonForm from '$lib/components/Forms/ButtonForm.svelte';
	import type { groupSchema } from '$lib/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<typeof groupSchema>>;
	export let deleteAction: string | undefined = undefined;

	const { form, constraints, enhance, errors, submitting } = superForm(data);
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

	<div class="flex justify-end gap-2" class:justify-between={deleteAction}>
		{#if deleteAction}
			<ButtonForm action={deleteAction} confirmation="Tem certeza que quer excluir?" let:submitting>
				<SubmitButton {submitting} class="btn btn-outline btn-error">Excluir</SubmitButton>
			</ButtonForm>
		{/if}

		<SubmitButton submitting={$submitting} class="btn btn-primary">Salvar</SubmitButton>
	</div>
</form>
