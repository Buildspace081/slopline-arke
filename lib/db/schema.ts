import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  leadDays: integer("lead_days").notNull(),
  materialId: text("material_id").notNull(),
});

export const materials = sqliteTable("materials", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  qty: integer("qty").notNull(),
  minStock: integer("min_stock").notNull(),
  location: text("location").notNull(),
});

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  email: text("email"),
  agent: text("agent"),
  channel: text("channel").notNull(),
});

export const orders = sqliteTable("orders", {
  number: integer("number").primaryKey({ autoIncrement: true }),
  customer: text("customer").notNull(),
  agent: text("agent"),
  channel: text("channel").notNull(),
  status: text("status").notNull(),
  promisedDate: text("promised_date").notNull(),
  sourceEmailId: integer("source_email_id"),
  notes: text("notes"),
});

export const orderLines = sqliteTable("order_lines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: integer("order_number").notNull(),
  productId: text("product_id").notNull(),
  qty: integer("qty").notNull(),
  customization: text("customization"),
});

export const orderEvents = sqliteTable("order_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: integer("order_number").notNull(),
  status: text("status").notNull(),
  at: text("at").notNull(),
  note: text("note"),
});

export const emails = sqliteTable("emails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  channel: text("channel").notNull(), // email | whatsapp-audio
  fromName: text("from_name").notNull(),
  fromAddress: text("from_address").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  receivedAt: text("received_at").notNull(),
  state: text("state").notNull().default("nuova"), // nuova | proposta | ordine_creato | scartata
  proposalJson: text("proposal_json"),
  orderNumber: integer("order_number"),
});

export const agentRuns = sqliteTable("agent_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  emailId: integer("email_id").notNull(),
  mode: text("mode").notNull(), // live | mock
  model: text("model").notNull(),
  stepsJson: text("steps_json").notNull(),
  startedAt: text("started_at").notNull(),
  durationMs: integer("duration_ms").notNull(),
});
