<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let action: string;
	export let afterSubmit: (() => void) | undefined = undefined;
	export let confirmation: string | false = 'Are you sure?';
	export let submitting = false;

	const submitFunction: SubmitFunction = async ({ cancel }) => {
		if (confirmation && !confirm(confirmation)) {
			cancel();
			return;
		}

		submitting = true;

		return async ({ update }) => {
			submitting = false;
			afterSubmit?.();

			update();
		};
	};
</script>

<form method="post" {action} use:enhance={submitFunction}>
	<slot {submitting} />
</form>
