<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import PasswordField from '$lib/components/FormFields/PasswordField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, submitting, enhance, errors, constraints } = superForm(data.form);
</script>

<svelte:head>
	<title>e-Wallet - Redefinir senha</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Redefinir senha</h1>
	<p>
		Quer atualizar sua conta? <a href="/app/account/edit" class="link">Clique aqui</a>.
	</p>
</div>

<div class="divider my-0"></div>

{#if $errors._errors}
	<div class="my-2">
		{#each $errors._errors as error}
			<Alert kind="error">{error}</Alert>
		{/each}
	</div>
{/if}

<form method="post" use:enhance class="flex flex-col gap-4">
	<PasswordField
		label="Senha atual"
		bind:value={$form.currentPassword}
		name="currentPassword"
		errors={$errors.currentPassword}
		{...$constraints.currentPassword}
		autocomplete="current-password"
	/>

	<PasswordField
		label="Nova senha"
		bind:value={$form.newPassword}
		name="newPassword"
		errors={$errors.newPassword}
		{...$constraints.newPassword}
		autocomplete="new-password"
	/>

	<PasswordField
		label="Confirmar nova senha"
		bind:value={$form.confirmNewPassword}
		name="confirmNewPassword"
		errors={$errors.confirmNewPassword}
		{...$constraints.confirmNewPassword}
	/>

	<div class="flex justify-end">
		<SubmitButton submitting={$submitting} class="btn btn-primary">Redefinir senha</SubmitButton>
	</div>
</form>
