import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	generateSessionToken,
	createSession
} from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';
import { getUserFromEmail, verifyPasswordHash } from '$lib/server/password';
import { getUserPasswordHash } from '$lib/server/user';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user === null) {
		return redirect(302, '/login');
	}

	const token = event.cookies.get('session') ?? null;

	if (token === null) {
		return new Response(null, {
			status: 401
		});
	}

	const { session } = await validateSessionToken(token);

	if (session === null) {
		deleteSessionTokenCookie(event);
		return new Response(null, {
			status: 401
		});
	}

	setSessionTokenCookie(event, token, session.expiresAt);

	// ...
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
			message: 'Invalid Username or Password.',
			email: ''
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

export const actions: Actions = {
	default: action
};
