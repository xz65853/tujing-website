import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCases() {
  const cases = await prisma.case.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">案例管理</h1>
        <Link href="/admin/cases/new" className="rounded-full bg-brand px-4 py-2 text-sm text-white">+ 新增案例</Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="p-3">标题</th><th className="p-3">行业</th><th className="p-3">状态</th><th className="p-3">首页推荐</th><th className="p-3">操作</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr key={c.id}>
                <td className="p-3 font-medium">{c.title}</td>
                <td className="p-3 text-slate-500">{c.industry}</td>
                <td className="p-3 text-slate-500">{c.status}</td>
                <td className="p-3">{c.featured ? "是" : "—"}</td>
                <td className="p-3">
                  <Link href={`/admin/cases/${c.id}/edit`} className="text-brand">编辑</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
