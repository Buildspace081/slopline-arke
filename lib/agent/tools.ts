import { tool } from "ai";
import { z } from "zod";
import { eq, like, or } from "drizzle-orm";
import { db, schema } from "../db";
import { STATUS, type StatusKey } from "../status";

const { products, materials, customers, orders, orderLines } = schema;

// Tool in sola lettura: l'agente non scrive mai direttamente. Crea una bozza,
// l'ordine nasce solo dopo la conferma umana (vedi app/posta/actions.ts).
export const agentTools = {
  searchCatalog: tool({
    description: "Cerca prodotti nel catalogo ufficiale per codice o nome. Restituisce id, codice, prezzo, giorni di produzione.",
    inputSchema: z.object({ query: z.string().describe("codice o parte del nome, es. MCL-02 o salopette") }),
    execute: async ({ query }) => {
      const q = `%${query}%`;
      return db.select().from(products).where(or(like(products.code, q), like(products.name, q), like(products.id, q))).all();
    },
  }),
  findCustomer: tool({
    description: "Cerca un cliente in anagrafica per nome o indirizzo email del mittente.",
    inputSchema: z.object({ query: z.string() }),
    execute: async ({ query }) => {
      const q = `%${query}%`;
      return db.select().from(customers).where(or(like(customers.name, q), like(customers.email, q))).all();
    },
  }),
  checkStock: tool({
    description: "Verifica la disponibilita del materiale necessario a un prodotto.",
    inputSchema: z.object({ productId: z.string(), qty: z.number().int().positive() }),
    execute: async ({ productId, qty }) => {
      const p = db.select().from(products).where(eq(products.id, productId)).get();
      if (!p) return { error: "prodotto non trovato" };
      const m = db.select().from(materials).where(eq(materials.id, p.materialId)).get()!;
      return { material: m.name, inStock: m.qty, minStock: m.minStock, enough: m.qty >= qty, note: "qty in pezzi equivalenti, indicativa" };
    },
  }),
  listCustomerOrders: tool({
    description: "Elenca gli ordini esistenti di un cliente con stato attuale e data promessa.",
    inputSchema: z.object({ customer: z.string() }),
    execute: async ({ customer }) => {
      const rows = db.select().from(orders).where(like(orders.customer, `%${customer}%`)).all();
      return rows.map((o) => ({
        number: o.number,
        status: STATUS[o.status as StatusKey]?.label ?? o.status,
        promisedDate: o.promisedDate,
        lines: db.select().from(orderLines).where(eq(orderLines.orderNumber, o.number)).all().map((l) => `${l.qty} x ${l.productId}`),
      }));
    },
  }),
};
