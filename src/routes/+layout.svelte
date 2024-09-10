<script lang="ts">
	import { navigating, page } from '$app/stores';
	import ButtonForm from '$lib/components/Forms/ButtonForm.svelte';
	import PageLoadingIndicator, {
		showPageLoadingIndicatorStore
	} from '$lib/components/PageLoadingIndicator.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import Toasts, { addToast } from '$lib/components/Toasts.svelte';
	import Dropdown from '$lib/components/UI/Dropdown.svelte';
	import { slide } from 'svelte/transition';
	import { getFlash } from 'sveltekit-flash-message';
	import IconAccount from '~icons/mdi/Account';
	import IconAccountEdit from '~icons/mdi/AccountEdit';
	import IconLogout from '~icons/mdi/Logout';
	import IconMapClock from '~icons/mdi/MapClock';
	import IconWallet from '~icons/mdi/Wallet';
	import '../app.postcss';

	export let data;

	const flash = getFlash(page);

	$: {
		if ($flash && $flash.asToast) {
			addToast({
				data: {
					kind: $flash.kind,
					description: $flash.message
				},
				closeDelay: 3000,
				type: 'foreground'
			});
		}
	}

	$: $showPageLoadingIndicatorStore = Boolean($navigating);
</script>

<Toasts />

<PageLoadingIndicator />

<div class="navbar bg-base-200">
	<div class="navbar-start">
		<a href="/app" class="btn btn-ghost">
			<IconWallet class="text-xl" />
			<span class="text-xl"> e-Wallet </span>
		</a>
	</div>
	<div class="navbar-end gap-2">
		<ThemeSwitch theme={data.theme} />
		{#if data.currentUser}
			<Dropdown
				let:item
				let:melt
				let:menu
				let:open
				let:overlay
				let:trigger
				props={{
					forceVisible: true,
					loop: true,
					positioning: {
						placement: 'bottom-end'
					}
				}}
			>
				<button use:melt={trigger} aria-label="Profile menu" class="btn btn-circle btn-ghost">
					<IconAccount class="text-2xl" />
				</button>

				{#if open}
					<div use:melt={overlay} class="fixed inset-0 z-40" />

					<div
						use:melt={menu}
						class="z-40 flex w-48 flex-col gap-1 rounded-box bg-base-300 p-2"
						transition:slide={{ duration: 100 }}
					>
						<a
							href="/app/account/edit"
							class="flex w-full items-center gap-2 rounded-lg p-2 data-[highlighted]:bg-base-content/5"
							use:melt={item}
						>
							<IconAccountEdit class="text-xl" />
							Atualizar conta
						</a>

						<a
							href="/app/account/timezone"
							class="flex w-full items-center gap-2 rounded-lg p-2 data-[highlighted]:bg-base-content/5"
							use:melt={item}
						>
							<IconMapClock class="text-xl" />
							Fuso horário
						</a>

						<ButtonForm
							action="/sign-out"
							bind:submitting={$showPageLoadingIndicatorStore}
							confirmation={false}
						>
							<button
								class="flex w-full items-center gap-2 rounded-lg p-2 text-error data-[highlighted]:bg-base-content/5"
								use:melt={item}
								type="submit"
							>
								<IconLogout class="text-xl" />
								Sair
							</button>
						</ButtonForm>
					</div>
				{/if}
			</Dropdown>
		{:else}
			<a href="/sign-in" class="btn btn-outline btn-primary uppercase">Entrar</a>
		{/if}
	</div>
</div>

<div class="mx-auto my-4 max-w-7xl px-4 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<slot />
	</div>
</div>
