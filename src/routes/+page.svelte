<script lang="ts">
	import IconWallet from '~icons/mdi/Wallet';
</script>

<svelte:head>
	<title>e-Wallet</title>
</svelte:head>

<div class="hero" style="min-height: calc(100vh - 96px);">
	<div class="hero-content text-center">
		<div class="max-w-lg">
			<h1 class="flex items-center justify-center gap-2 text-5xl font-bold">
				<IconWallet />
				e-Wallet
			</h1>
			<h2 class="mt-2 text-4xl font-bold">Sua carteira digital</h2>
			<p class="py-6">
				Gerencie suas transações de cartão de crédito, e fique por dentro das suas finanças.
			</p>
			<a href="/app" class="btn btn-primary">Começar</a>
		</div>
	</div>
</div>
