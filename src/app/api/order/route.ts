import { prisma } from "@/lib/db";
import { createJsapiOrder, genOutTradeNo, wechatConfig } from "@/lib/wechat";
import { getMemberFromRequest, json } from "@/lib/api-helper";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/order  创建订单并返回小程序支付参数
export async function POST(req: NextRequest) {
  const member = await getMemberFromRequest(req);
  if (!member) return json({ error: "请先登录" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const productId = Number(body.productId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.published) return json({ error: "套餐不存在" }, { status: 400 });

  const outTradeNo = genOutTradeNo();
  const order = await prisma.order.create({
    data: {
      outTradeNo,
      memberId: member.id,
      productId: product.id,
      amount: product.price,
      status: "pending",
      contactName: body.contactName || "",
      contactPhone: body.contactPhone || "",
      remark: body.remark || "",
    },
  });

  // 微信支付未配置时：返回订单号，前端提示"支付通道未配置，请联系客服"
  if (!wechatConfig.mchid || !wechatConfig.appid) {
    return json({
      orderId: order.id,
      outTradeNo: order.outTradeNo,
      payParams: null,
      message: "支付通道未配置，订单已创建，请联系客服付款",
    });
  }

  try {
    const payParams = await createJsapiOrder({
      outTradeNo: order.outTradeNo,
      openid: member.openid,
      amount: product.price,
      description: product.name,
    });
    return json({ orderId: order.id, outTradeNo: order.outTradeNo, payParams });
  } catch (e) {
    return json({ error: `微信下单失败: ${(e as Error).message}` }, { status: 500 });
  }
}
