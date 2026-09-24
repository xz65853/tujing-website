import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminMembers() {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
    take: 200,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">小程序会员</h1>
      <p className="mt-2 text-sm text-slate-500">共 {members.length} 人通过微信登录过小程序</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">昵称</th>
              <th className="p-3">手机号</th>
              <th className="p-3">订单数</th>
              <th className="p-3">登录时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="p-3">{m.nickname || "微信用户"}</td>
                <td className="p-3">{m.phone || "—"}</td>
                <td className="p-3">{m._count.orders}</td>
                <td className="p-3 text-xs text-slate-400">{m.createdAt.toLocaleString("zh-CN")}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">还没有会员</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
