import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "成功案例" };

export default async function CasesPage() {
  const [categories, cases] = await Promise.all([
    prisma.caseCategory.findMany({ orderBy: { sort: "asc" } }),
    prisma.case.findMany({ where: { status: "published" }, orderBy: { sort: "asc" }, include: { category: true } }),
  ]);
  return (
    <div className="container-x py-20">
      <h1 className="text-3xl font-bold text-ink">成功案例</h1>
      <p className="mt-3 text-slate-500">真实的服务过程与项目经验（数据以客户实际后台为准）。</p>
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="rounded-full bg-ink px-3 py-1.5 text-xs text-white">全部</span>
        {categories.map((c) => (
          <span key={c.id} className="rounded-full bg-surface px-3 py-1.5 text-xs text-slate-600">{c.name}</span>
        ))}
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <Link key={c.id} href={`/cases/${c.slug}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="flex h-44 items-center justify-center bg-gradient-to-br from-ink to-brand text-sm text-white/70">案例封面</div>
            <div className="p-5">
              <p className="text-xs text-slate-400">{c.industry} · {c.projectType}</p>
              <h2 className="mt-1 font-semibold text-ink group-hover:text-brand">{c.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{c.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
