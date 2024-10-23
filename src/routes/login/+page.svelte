<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex flex-col w-80">
	<h1 class="text-4xl font-bold">Sign in</h1>
	<form method="post" use:enhance class="flex flex-col gap-4 mt-8">
		<label for="form-login.email" class="flex flex-col gap-2">
			<span class="text-slate-500">Email</span>
			<input
				class="border w-80 px-4 py-2"
				type="email"
				id="form-login.email"
				name="email"
				autocomplete="username"
				required
				value={form?.email ?? ''}
			/>
		</label>
		<label for="form-login.password" class="flex flex-col gap-2">
			<span class="text-slate-500">Password</span>
			<input
				class="border w-80 px-4 py-2"
				type="password"
				id="form-login.password"
				name="password"
				autocomplete="current-password"
				required
			/>
		</label>

		<button class="bg-slate-900 hover:bg-slate-500 text-white font-bold rounded py-2 text-xl">
			Continue
		</button>
		<p>{form?.message ?? ''}</p>
	</form>
	<a href="/signup" class="ml-auto text-blue-500 hover:underline">Create an account</a>
</div>
