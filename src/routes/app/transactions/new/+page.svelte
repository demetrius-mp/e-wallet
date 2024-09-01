<script lang="ts">
	import TransactionForm from '$lib/components/Forms/TransactionForm.svelte';

	export let data;
</script>

<svelte:head>
	<title>e-Wallet | Nova transação</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Nova transação</h1>
</div>

<div class="divider my-0"></div>

<TransactionForm data={data.form} />
