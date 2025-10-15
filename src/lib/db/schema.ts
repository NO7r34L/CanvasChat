import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users as usersTable } from "./auth-schema";

export { usersTable };

// Canvases Table
export const canvasesTable = pgTable('canvases', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('Untitled Canvas'),
  fabricData: text('fabric_data').notNull(),
  thumbnail: text('thumbnail'),
  width: integer('width').notNull().default(1200),
  height: integer('height').notNull().default(800),
  isPublic: boolean('is_public').default(false),
  isFavorite: boolean('is_favorite').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

// Canvas History Table
export const canvasHistoryTable = pgTable('canvas_history', {
  id: serial('id').primaryKey(),
  canvasId: integer('canvas_id').notNull().references(() => canvasesTable.id, { onDelete: 'cascade' }),
  fabricData: text('fabric_data').notNull(),
  version: integer('version').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Collaborations Table
export const collaborationsTable = pgTable('collaborations', {
  id: serial('id').primaryKey(),
  canvasId: integer('canvas_id').notNull().references(() => canvasesTable.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['viewer', 'editor', 'owner'] }).notNull().default('viewer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Comments Table
export const commentsTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  canvasId: integer('canvas_id').notNull().references(() => canvasesTable.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  positionX: integer('position_x'),
  positionY: integer('position_y'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Templates Table
export const templatesTable = pgTable('templates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  fabricData: text('fabric_data').notNull(),
  thumbnail: text('thumbnail'),
  category: text('category'),
  isOfficial: boolean('is_official').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Teams Table
export const teamsTable = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Team Members Table
export const teamMembersTable = pgTable('team_members', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teamsTable.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'member'] }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Analytics Table
export const analyticsTable = pgTable('analytics', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  event: text('event').notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports
export type InsertCanvas = typeof canvasesTable.$inferInsert;
export type SelectCanvas = typeof canvasesTable.$inferSelect;
export type InsertCanvasHistory = typeof canvasHistoryTable.$inferInsert;
export type SelectCanvasHistory = typeof canvasHistoryTable.$inferSelect;
export type InsertCollaboration = typeof collaborationsTable.$inferInsert;
export type SelectCollaboration = typeof collaborationsTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;
export type SelectComment = typeof commentsTable.$inferSelect;
export type InsertTemplate = typeof templatesTable.$inferInsert;
export type SelectTemplate = typeof templatesTable.$inferSelect;
export type InsertTeam = typeof teamsTable.$inferInsert;
export type SelectTeam = typeof teamsTable.$inferSelect;
export type InsertTeamMember = typeof teamMembersTable.$inferInsert;
export type SelectTeamMember = typeof teamMembersTable.$inferSelect;
export type InsertAnalytics = typeof analyticsTable.$inferInsert;
export type SelectAnalytics = typeof analyticsTable.$inferSelect;
