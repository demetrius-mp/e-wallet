<script lang="ts" context="module">
	import cookies from 'cookie';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export const THEMES = ['light', 'dark'] as const;
	export type Theme = (typeof THEMES)[number];

	export function checkIsTheme(theme: unknown): theme is Theme {
		return typeof theme === 'string' && THEMES.includes(theme as Theme);
	}

	function createThemeStore() {
		const { subscribe, set } = writable<Theme>('light');

		return {
			subscribe,
			set: (theme: Theme) => {
				set(theme);
				document.cookie = cookies.serialize('theme', theme, {
					maxAge: 60 * 60 * 24 * 7,
					path: '/'
				});

				document.documentElement.setAttribute('data-theme', theme);
			}
		};
	}

	export const theme = createThemeStore();
</script>

<script lang="ts">
	import IconWeatherNight from '~icons/mdi/WeatherNight';
	import IconWeatherSunny from '~icons/mdi/WeatherSunny';

	function toggleTheme() {
		$theme = $theme === 'light' ? 'dark' : 'light';
	}

	onMount(() => {
		const documentTheme = document.documentElement.getAttribute('data-theme');

		if (checkIsTheme(documentTheme)) {
			$theme = documentTheme;
		}
	});

	$: ariaLabel = $theme === 'light' ? 'Alterar para tema escuro' : 'Alterar para tema claro';
</script>

<button on:click={toggleTheme} aria-label={ariaLabel} class="btn btn-circle btn-ghost text-2xl">
	{#if $theme === 'light'}
		<IconWeatherNight />
	{:else if $theme === 'dark'}
		<IconWeatherSunny />
	{/if}
</button>
