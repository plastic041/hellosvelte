<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-dvh w-full bg-slate-100">
	<div class="container mx-auto grid bg-white shadow min-h-dvh p-16">
		{@render children()}
	</div>
</div>
