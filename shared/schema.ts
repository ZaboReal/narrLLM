import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNarrationChainSchema = createInsertSchema(narrationChains).pick({
  rawText: true,
  analyzedData: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNarrationChain = z.infer<typeof insertNarrationChainSchema>;
export type NarrationChain = typeof narrationChains.$inferSelect;
