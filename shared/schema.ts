import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const narrationChains = pgTable("narration_chains", {
  id: serial("id").primaryKey(),
  rawText: text("raw_text").notNull(),
  analyzedData: text("analyzed_data").notNull(),
  createdAt: text("created_at").notNull(),
});

export const narrators = pgTable("narrators", {
  id: serial("id").primaryKey(),
  narratorId: text("narrator_id"),
  fullName: text("full_name").notNull(),
  kunya: text("kunya"),
  titles: text("titles"),
  adjectives: text("adjectives"),
  location: text("location"),
  deathDate: text("death_date"),
  grade: text("grade"),
  books: text("books"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNarrationChainSchema = createInsertSchema(narrationChains).pick({
  rawText: true,
  analyzedData: true,
  createdAt: true,
});

export const insertNarratorSchema = createInsertSchema(narrators).pick({
  narratorId: true,
  fullName: true,
  kunya: true,
  titles: true,
  adjectives: true,
  location: true,
  deathDate: true,
  grade: true,
  books: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNarrationChain = z.infer<typeof insertNarrationChainSchema>;
export type NarrationChain = typeof narrationChains.$inferSelect;

export type InsertNarrator = z.infer<typeof insertNarratorSchema>;
export type Narrator = typeof narrators.$inferSelect;
