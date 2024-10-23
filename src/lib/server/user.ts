import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { userTable, type User } from '../schema';
import { hashPassword } from './password';

export async function getUserPasswordHash(userId: number): Promise<string> {
	const rows = await db
		.select({ passwordHash: userTable.passwordHash })
		.from(userTable)
		.where(eq(userTable.id, userId));

	if (rows.length !== 1) {
		throw new Error('Invalid user ID');
	}

	return rows[0].passwordHash;
}

export async function createUser(email: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	const result = await db.insert(userTable).values({ email, passwordHash }).returning();

	if (result === null) {
		throw new Error('Unexpected error');
	}
	return result[0];
}
