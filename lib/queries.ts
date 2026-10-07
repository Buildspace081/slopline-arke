import { db, schema } from "./db";
import { eq, desc } from "drizzle-orm";
import { STATUS, type StatusKey } from "./status";

const { orders, orderLines, orderEvents, products, emails, materials } = schema;
export const TODAY = () => new Date().toISOString().slice(0, 10);

export function listOrders() {
  const prods = Object.fromEntries(db.select().from(products).all().map((p) => [p.id, p]));
  return db.select().from(orders).orderBy(desc(orders.number)).all().map((o) => {
    const lines = db.select().from(orderLines).where(eq(orderLines.orderNumber, o.number)).all();
    return {
      ...o,
      lines: lines.map((l) => ({ ...l, product: prods[l.productId] })),
      pieces: lines.reduce((s, l) => s + l.qty, 0),
      late: o.status !== "spedito" && o.promisedDate < TODAY(),
      statusLabel: STATUS[o.status as StatusKey]?.label ?? o.status,
    };
  });
}

export function getOrder(n: number) {
  return listOrders().find((o) => o.number === n) ?? null;
}
export function getEvents(n: number) {
  return db.select().from(orderEvents).where(eq(orderEvents.orderNumber, n)).all();
}
export function listEmails() {
  return db.select().from(emails).orderBy(desc(emails.receivedAt)).all();
}
export function getEmail(id: number) {
  return db.select().from(emails).where(eq(emails.id, id)).get() ?? null;
}
export function listMaterials() {
  return db.select().from(materials).all();
}
