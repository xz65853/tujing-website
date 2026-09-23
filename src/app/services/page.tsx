import Link from "next/link";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";

export const metadata = { title: "服务项目" };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sort: "asc" },
    include: { category: true },
  });
  return (
    <div className="container-x py-20">
      <h1 className="text-3xl font-bold text-ink">服务项目</h1>
      <p className="mt-3 text-slate-500">从内容、直播到投放，建立完整的线上运营链路。</p>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const feats = safeJson<string[]>(s.features, []);
          return (
            <Link key={s.id} href={`/services/${s.slug}`} className="rounded-2xl border border-slate-100 bg-surface p-6 transition hover:shadow-md">
              <p className="text-xs tracking-widest text-brand">{s.nameEn}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{s.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{s.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {feats.map((f) => (
                  <span key={f} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">{f}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
