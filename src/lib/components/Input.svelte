<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	const { class: _class, ...props }: HTMLInputAttributes = $props();
</script>

<input class={twMerge('border w-80 px-4 py-2', _class)} {...props} />
