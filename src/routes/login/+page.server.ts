import { fail, redirect } from '@sveltejs/kit';
import { getUserPasswordHash } from '$lib/server/user';
import { getUserFromEmail, verifyPasswordHash } from '$lib/server/password';
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
			email: ''
		});
	}
	if (email === '' || password === '') {
		return fail(400, {
			message: 'Please enter your email and password.',
			email
		});
	}
	const user = await getUserFromEmail(email);
	if (user === null) {
		return fail(400, {
			message: 'Account does not exist',
			email
		});
	}
	const passwordHash = await getUserPasswordHash(user.id);
	const validPassword = await verifyPasswordHash(passwordHash, password);
	if (!validPassword) {
		return fail(400, {
			message: 'Invalid password',
			email
		});
	}
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return redirect(302, '/');
}
