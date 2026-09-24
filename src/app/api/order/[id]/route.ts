import { prisma } from "@/lib/db";
import { getMemberFromRequest, json } from "@/lib/api-helper";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/order/[id]  订单详情
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const member = await getMemberFromRequest(req);
  if (!member) return json({ error: "请先登录" }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { product: true },
  });
  if (!order || order.memberId !== member.id) return json({ error: "not found" }, { status: 404 });

  return json({
    id: order.id,
    outTradeNo: order.outTradeNo,
    status: order.status,
    amount: order.amount,
    contactName: order.contactName,
    contactPhone: order.contactPhone,
    remark: order.remark,
    transactionId: order.transactionId,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    product: order.product,
  });
}
