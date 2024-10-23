import type { InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
	id: int('id').primaryKey(),
	email: text().notNull(),
	passwordHash: text().notNull()
});

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: int('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: int('expires_at', {
		mode: 'timestamp'
	}).notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
