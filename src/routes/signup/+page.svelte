<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex flex-col w-80">
	<h1 class="text-4xl font-bold">Create an account</h1>
	<form method="post" use:enhance class="flex flex-col gap-4 mt-8">
		<label for="form-signup.email" class="flex flex-col gap-2">
			<span class="text-slate-500">Email</span>
			<Input
				type="email"
				id="form-signup.email"
				name="email"
				autocomplete="username"
				required
				value={form?.email ?? ''}
			/>
		</label>
		<label for="form-signup.password" class="flex flex-col gap-2">
			<span class="text-slate-500">Password</span>
			<Input
				type="password"
				id="form-signup.password"
				name="password"
				autocomplete="new-password"
				required
			/>
		</label>
		<Button>Continue</Button>
		<p>{form?.message ?? ''}</p>
	</form>
	<a href="/login" class="ml-auto text-blue-500 hover:underline">Sign in</a>
</div>
