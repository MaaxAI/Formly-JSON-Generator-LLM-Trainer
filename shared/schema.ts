import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// FormlyField schema - represents basic formly field configuration
export const formlyFieldSchema = z.object({
  key: z.string(),
  type: z.string(),
  props: z.record(z.any()).optional(),
  validation: z.record(z.any()).optional(),
  expressions: z.record(z.string()).optional()
});

// FormConfiguration schema - represents a complete form configuration
export const formConfigurationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  model: z.string(),
  className: z.string().optional(),
  fields: z.array(formlyFieldSchema)
});

// TrainingData schema - represents training data records
export const trainingDataSchema = z.object({
  source: z.string(), // 'form', 'documentation', 'example'
  content: z.string(),
  type: z.string().optional()
});

// TrainingModel schema - represents a trained model
export const trainingModelSchema = z.object({
  name: z.string(),
  baseModel: z.string(),
  epochs: z.number(),
  learningRate: z.string(),
  includeDocs: z.boolean(),
  includeExamples: z.boolean(),
  status: z.string() // 'training', 'complete', 'failed'
});

// Database tables
export const formConfigurations = pgTable("form_configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  model: text("model").notNull(),
  className: text("class_name"),
  fields: jsonb("fields").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const trainingData = pgTable("training_data", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  content: text("content").notNull(),
  type: text("type"),
  createdAt: text("created_at").notNull()
});

export const trainingModels = pgTable("training_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  baseModel: text("base_model").notNull(),
  epochs: integer("epochs").notNull(),
  learningRate: text("learning_rate").notNull(),
  includeDocs: boolean("include_docs").notNull(),
  includeExamples: boolean("include_examples").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

// Insert schemas
export const insertFormConfigurationSchema = createInsertSchema(formConfigurations).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export const insertTrainingDataSchema = createInsertSchema(trainingData).omit({ 
  id: true,
  createdAt: true
});

export const insertTrainingModelSchema = createInsertSchema(trainingModels).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types
export type FormlyField = z.infer<typeof formlyFieldSchema>;
export type FormConfiguration = z.infer<typeof formConfigurationSchema>;
export type TrainingData = z.infer<typeof trainingDataSchema>;
export type TrainingModel = z.infer<typeof trainingModelSchema>;

export type InsertFormConfiguration = z.infer<typeof insertFormConfigurationSchema>;
export type InsertTrainingData = z.infer<typeof insertTrainingDataSchema>;
export type InsertTrainingModel = z.infer<typeof insertTrainingModelSchema>;

export type FormConfigurationRecord = typeof formConfigurations.$inferSelect;
export type TrainingDataRecord = typeof trainingData.$inferSelect;
export type TrainingModelRecord = typeof trainingModels.$inferSelect;
