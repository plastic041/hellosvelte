import type { RequestEvent } from '@sveltejs/kit';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { eq } from 'drizzle-orm';
import { type User, type Session, sessionTable, userTable } from '../schema';
import { db } from '../db';

export function generateSessionToken(): string {
	const token = crypto.randomUUID();

	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 + 60 * 24 * 30)
	};

	await db.insert(sessionTable).values(session);

	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId));

	if (result.length < 1) {
		return { session: null, user: null };
	}

	const { user, session } = result[0];

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 24 * 24 * 60 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 24 * 24 * 60 * 30);
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}
