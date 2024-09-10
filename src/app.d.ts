import type { Theme } from '$lib/components/ThemeSwitch.svelte';
import 'unplugin-icons/types/svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type FlashMessageKind = 'error' | 'success' | 'info' | 'warning';
		// interface Error {}
		interface Locals {
			currentUser?: Omit<import('@prisma/client').User, 'password' | 'archived'>;
			theme: Theme;
		}
		interface PageData {
			flash?: {
				kind: FlashMessageKind;
				message: string;
				asToast?: boolean;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
