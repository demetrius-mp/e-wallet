<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>e-Wallet - Erro</title>
</svelte:head>

<div class="hero" style="min-height: calc(100vh - 96px);">
	<div class="hero-content text-center">
		<div class="max-w-lg">
			{#if $page.status === 404}
				<h1 class="text-5xl font-bold">
					{$page.error?.message || 'Página não encontrada'}
				</h1>
				<p class="py-6">
					A página que você está tentando acessar não existe ou foi movida para outro endereço.
				</p>
				<a href="/app" class="btn btn-primary">Ir para a página inicial</a>
			{:else}
				<h1 class="text-5xl font-bold">Algo deu errado</h1>
				<p class="py-6">
					Desculpe, mas algo deu errado. Por favor, tente novamente mais tarde ou contate o
					administrador.
				</p>
				<a href="/app" class="btn btn-primary">Ir para a página inicial</a>
			{/if}
		</div>
	</div>
</div>
