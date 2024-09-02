<script lang="ts">
	import TransactionForm from '$lib/components/Forms/TransactionForm.svelte';

	export let data;
</script>

<svelte:head>
	<title>e-Wallet | Editar transação</title>
</svelte:head>

<div>
	<h1 class="text-2xl">Editar transação</h1>
</div>

<div class="divider my-0"></div>

<TransactionForm data={data.form} deleteAction="/app/transactions/{data.transaction.id}/delete" />
