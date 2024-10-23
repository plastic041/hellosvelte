<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	{#if data.user !== null}
		<h1>Hi {data.user.email}!</h1>
		<form method="post" use:enhance>
			<button>Sign out</button>
		</form>
	{:else}
		<a href="/login">Log in</a>
	{/if}
</main>
