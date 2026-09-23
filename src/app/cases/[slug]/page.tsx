import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await prisma.case.findUnique({ where: { slug: params.slug } });
  if (!c) return {};
  return { title: c.seoTitle || c.title, description: c.seoDesc || c.summary || "" };
}

export default async function CaseDetail({ params }: { params: { slug: string } }) {
  const c = await prisma.case.findUnique({ where: { slug: params.slug } });
  if (!c || c.status !== "published") notFound();
  const metrics = safeJson<{ label: string; value: string }[]>(c.metrics, []);

  return (
    <article className="container-x py-20">
      <p className="text-sm text-slate-400">{c.industry} · {c.projectType}</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">{c.title}</h1>
      {c.subtitle && <p className="mt-2 text-slate-500">{c.subtitle}</p>}
      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-ink">项目背景</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-slate-600">{c.background}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">运营策略</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-slate-600">{c.strategy}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">执行内容</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-slate-600">{c.execution}</p>
        </section>
        {c.dataVisible && metrics.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-ink">项目数据</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-surface p-5 text-center">
                  <p className="text-2xl font-bold text-brand">{m.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-xl font-semibold text-ink">项目结果</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-slate-600">{c.result}</p>
        </section>
      </div>
    </article>
  );
}
