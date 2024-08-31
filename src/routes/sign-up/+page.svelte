<script lang="ts">
	import InputField from '$lib/components/FormFields/InputField.svelte';
	import PasswordField from '$lib/components/FormFields/PasswordField.svelte';
	import SubmitButton from '$lib/components/FormFields/SubmitButton.svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, submitting, enhance, errors, constraints } = superForm(data.form);
</script>

<svelte:head>
	<title>e-Wallet - Sign up</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Sign up</h1>
	<p>
		Want to sign in? <a href="/sign-in" class="link">Click here</a>.
	</p>
</div>

<div class="divider my-0"></div>

<form method="post" use:enhance class="flex flex-col gap-4">
	<InputField
		label="Name"
		bind:value={$form.name}
		name="name"
		errors={$errors.name}
		{...$constraints.name}
		type="text"
		autocomplete="name"
	/>

	<InputField
		label="Email"
		bind:value={$form.email}
		name="email"
		errors={$errors.email}
		{...$constraints.email}
		type="email"
		inputmode="email"
		autocomplete="email"
	/>

	<PasswordField
		label="Password"
		bind:value={$form.password}
		name="password"
		errors={$errors.password}
		{...$constraints.password}
		autocomplete="new-password"
	/>

	<PasswordField
		label="Confirm password"
		bind:value={$form.confirmPassword}
		name="confirmPassword"
		errors={$errors.confirmPassword}
		{...$constraints.confirmPassword}
	/>

	<div class="flex justify-end">
		<SubmitButton submitting={$submitting} class="btn btn-primary">Sign up</SubmitButton>
	</div>
</form>
