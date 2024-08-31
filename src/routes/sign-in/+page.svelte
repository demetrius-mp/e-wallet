<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import InputField from '$lib/components/FormFields/InputField.svelte';
	import PasswordField from '$lib/components/FormFields/PasswordField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, submitting, enhance, errors, constraints } = superForm(data.form);
</script>

<svelte:head>
	<title>e-Wallet - Entrar</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Entrar</h1>
	<p>
		Quer criar sua conta? <a href="/sign-up" class="link">Clique aqui</a>.
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
	<InputField
		label="Email"
		bind:value={$form.email}
		name="email"
		errors={$errors.email}
		{...$constraints.email}
		invalid={Boolean($errors._errors)}
		type="email"
		autocomplete="email"
		inputmode="email"
	/>

	<PasswordField
		label="Senha"
		bind:value={$form.password}
		name="password"
		errors={$errors.password}
		{...$constraints.password}
		invalid={Boolean($errors._errors)}
		autocomplete="current-password"
	/>

	<div class="flex justify-end">
		<SubmitButton submitting={$submitting} class="btn btn-primary">Entrar</SubmitButton>
	</div>
</form>
