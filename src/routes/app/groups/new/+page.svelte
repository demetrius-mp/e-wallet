<script lang="ts">
	import GroupForm from '$lib/components/Forms/GroupForm.svelte';

	export let data;
</script>

<svelte:head>
	<title>e-Wallet | Novo grupo</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Novo grupo</h1>
</div>

<div class="divider my-0"></div>

<GroupForm data={data.form} />
