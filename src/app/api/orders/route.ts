import { prisma } from "@/lib/db";
import { getMemberFromRequest, json } from "@/lib/api-helper";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/orders  我的订单列表
export async function GET(req: NextRequest) {
  const member = await getMemberFromRequest(req);
  if (!member) return json({ error: "请先登录" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { memberId: member.id },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
  return json(
    orders.map((o) => ({
      id: o.id,
      outTradeNo: o.outTradeNo,
      status: o.status,
      amount: o.amount,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
      product: { id: o.product.id, name: o.product.name, cover: o.product.cover, duration: o.product.duration },
    })),
  );
}
