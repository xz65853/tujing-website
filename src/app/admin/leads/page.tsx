import Link from "next/link";
import { prisma } from "@/lib/db";
import { LEAD_STATUS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-xl font-bold text-ink">客户线索</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">客户</th>
              <th className="p-3">联系方式</th>
              <th className="p-3">需求</th>
              <th className="p-3">来源</th>
              <th className="p-3">状态</th>
              <th className="p-3">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="p-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-medium text-brand">{l.name}</Link>
                  <div className="text-xs text-slate-400">{l.company || "—"}</div>
                </td>
                <td className="p-3">{l.phone}</td>
                <td className="p-3">{l.requirements || "—"}</td>
                <td className="p-3 text-xs text-slate-400">{l.sourcePage}</td>
                <td className="p-3">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand">{LEAD_STATUS[l.status] || l.status}</span>
                </td>
                <td className="p-3 text-xs text-slate-400">{l.createdAt.toLocaleString("zh-CN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
