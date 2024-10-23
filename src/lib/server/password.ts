import { userTable, type User } from '$lib/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';

export async function hashPassword(password: string): Promise<string> {
	return await hash(password);
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password);
}

export async function getUserFromEmail(email: string): Promise<User | null> {
	const rows = await db.select().from(userTable).where(eq(userTable.email, email));

	if (rows.length === 0) {
		return null;
	}

	return rows[0];
}
