<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	const { children, class: _class, ...props }: HTMLButtonAttributes = $props();
</script>

<button
	{...props}
	class={twMerge(
		'bg-slate-900 hover:bg-slate-500 text-white font-bold rounded py-2 text-xl',
		_class
	)}
>
	{@render children?.()}
</button>
