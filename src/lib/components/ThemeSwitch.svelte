<script lang="ts" context="module">
	import cookies from 'cookie';

	export const THEMES = ['light', 'dark'] as const;
	export type Theme = (typeof THEMES)[number];

	export function checkIsTheme(theme: unknown): theme is Theme {
		return typeof theme === 'string' && THEMES.includes(theme as Theme);
	}
</script>

<script lang="ts">
	import IconWeatherNight from '~icons/mdi/WeatherNight';
	import IconWeatherSunny from '~icons/mdi/WeatherSunny';

	export let theme: Theme;

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';

		document.cookie = cookies.serialize('theme', theme, {
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
			httpOnly: false,
			secure: false
		});

		document.documentElement.setAttribute('data-theme', theme);
	}

	$: ariaLabel = theme === 'light' ? 'Alterar para tema escuro' : 'Alterar para tema claro';
</script>

<button on:click={toggleTheme} aria-label={ariaLabel} class="btn btn-circle btn-ghost text-2xl">
	{#if theme === 'light'}
		<IconWeatherNight />
	{:else if theme === 'dark'}
		<IconWeatherSunny />
	{/if}
</button>
