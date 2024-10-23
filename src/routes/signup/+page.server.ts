import { fail, redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';

import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';

export function load(event: PageServerLoadEvent) {
	if (event.locals.session !== null && event.locals.user !== null) {
		return redirect(302, '/');
	}
	return {};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	const formData = await event.request.formData();
	const email = formData.get('email');
	const password = formData.get('password');
	if (typeof email !== 'string' || typeof password !== 'string') {
		return fail(400, {
			message: 'Invalid or missing fields',
			email: '',
			username: ''
		});
	}
	if (email === '' || password === '') {
		return fail(400, {
			message: 'Please enter your username, email, and password',
			email: '',
			username: ''
		});
	}
	const user = await createUser(email, password);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	throw redirect(302, '/');
}
