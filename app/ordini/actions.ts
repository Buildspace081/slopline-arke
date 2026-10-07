"use server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { STATUS, type StatusKey } from "@/lib/status";
import { TODAY } from "@/lib/queries";

export async function setStatus(n: number, status: StatusKey) {
  if (!(status in STATUS)) return;
  db.update(schema.orders).set({ status }).where(eq(schema.orders.number, n)).run();
  db.insert(schema.orderEvents).values({ orderNumber: n, status, at: TODAY() }).run();
  revalidatePath("/"); revalidatePath(`/ordini/${n}`);
}
