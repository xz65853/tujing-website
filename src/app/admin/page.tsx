import Link from "next/link";
import { prisma } from "@/lib/db";
import { LEAD_STATUS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayLeads, monthLeads, pending, deals, recentLeads, recentCases, recentArticles] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { status: { in: ["pending", "contacted", "intention"] } } }),
    prisma.lead.count({ where: { status: "deal" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "今日新增线索", value: todayLeads },
    { label: "本月线索", value: monthLeads },
    { label: "待跟进", value: pending },
    { label: "已成交", value: deals },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">工作台</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">最近客户</h2>
            <Link href="/admin/leads" className="text-sm text-brand">全部 →</Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-2 text-sm">
                <span>{l.name} · {l.company || "—"}</span>
                <span className="text-xs text-slate-400">{LEAD_STATUS[l.status] || l.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-ink">最近案例</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {recentCases.map((c) => <li key={c.id}>{c.title}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-ink">最近文章</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {recentArticles.map((a) => <li key={a.id}>{a.title}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
