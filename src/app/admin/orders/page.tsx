import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  delivered: "已交付",
  completed: "已完成",
  refunded: "已退款",
  closed: "已关闭",
};

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, member: true },
    take: 200,
  });

  const total = orders.reduce((s, o) => s + (o.status === "paid" || o.status === "delivered" || o.status === "completed" ? o.amount : 0), 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">订单管理</h1>
      <p className="mt-2 text-sm text-slate-500">
        已收款合计：<span className="font-semibold text-brand">¥{(total / 100).toFixed(2)}</span>（共 {orders.length} 笔）
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">订单号</th>
              <th className="p-3">套餐</th>
              <th className="p-3">金额</th>
              <th className="p-3">联系人</th>
              <th className="p-3">状态</th>
              <th className="p-3">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{o.outTradeNo}</td>
                <td className="p-3">{o.product.name}</td>
                <td className="p-3 font-medium">¥{(o.amount / 100).toFixed(2)}</td>
                <td className="p-3 text-xs">
                  {o.contactName || o.member.nickname || "—"}
                  <div className="text-slate-400">{o.contactPhone || ""}</div>
                </td>
                <td className="p-3">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand">{STATUS[o.status] || o.status}</span>
                </td>
                <td className="p-3 text-xs text-slate-400">{o.createdAt.toLocaleString("zh-CN")}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">还没有订单，用户在小程序下单后会出现在这里</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
