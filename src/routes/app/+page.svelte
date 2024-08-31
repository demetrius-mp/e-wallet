<script lang="ts">
	import IconArrowRight from '~icons/mdi/ArrowRight';
	export let data;
</script>

<svelte:head>
	<title>e-Wallet | App</title>
</svelte:head>

<h1 class="text-2xl">
	Bem-vindo, {data.currentUser.name}!
</h1>

<div class="divider my-0"></div>

<div class="mt-2 flex flex-col gap-4">
	<a href="/app/transactions" class="flex flex-col gap-2 rounded-xl bg-base-200 p-4 shadow-lg">
		<div class="flex items-center justify-between gap-2">
			<h2 class="text-xl font-semibold">Transações</h2>
			<div>
				<IconArrowRight class="text-xl" />
			</div>
		</div>

		<p>Visualize suas transações de cartão de crédito.</p>
	</a>
</div>
