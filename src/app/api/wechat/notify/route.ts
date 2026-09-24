import { prisma } from "@/lib/db";
import { decryptResource } from "@/lib/wechat";

export const dynamic = "force-dynamic";

// POST /api/wechat/notify  微信支付结果回调
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.resource) return Response.json({ code: "FAIL", message: "bad request" }, { status: 400 });

  try {
    const decoded = decryptResource(body.resource);
    // decoded: { out_trade_no, transaction_id, trade_state, amount, ... }
    if (decoded.trade_state === "SUCCESS") {
      await prisma.order.update({
        where: { outTradeNo: decoded.out_trade_no },
        data: {
          status: "paid",
          transactionId: decoded.transaction_id,
          paidAt: new Date(),
        },
      });
    }
  } catch (e) {
    return Response.json({ code: "FAIL", message: (e as Error).message }, { status: 500 });
  }

  return Response.json({ code: "SUCCESS", message: "成功" });
}
