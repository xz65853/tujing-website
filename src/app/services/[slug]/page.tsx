import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!s) return {};
  return { title: s.seoTitle || s.name, description: s.seoDesc || s.summary || "" };
}

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!s || !s.published) notFound();
  const feats = safeJson<string[]>(s.features, []);

  return (
    <div className="container-x py-20">
      <p className="text-sm text-slate-400">服务项目</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">{s.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{s.summary}</p>
      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {feats.map((f) => (
          <div key={f} className="rounded-xl border border-slate-100 bg-surface p-4 text-sm">{f}</div>
        ))}
      </div>
      {s.description && (
        <div className="mt-12 max-w-3xl leading-8 text-slate-600">
          <h2 className="text-xl font-semibold text-ink">服务说明</h2>
          <p className="mt-4 whitespace-pre-line">{s.description}</p>
        </div>
      )}
      <div className="mt-16 rounded-2xl bg-ink p-8 text-white">
        <h3 className="text-xl font-semibold">想了解 {s.name} 是否适合你的业务？</h3>
        <p className="mt-2 text-slate-300">告诉我们你的情况，获取一份初步运营思路。</p>
        <Link href="/contact" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium">免费获取运营方案</Link>
      </div>
    </div>
  );
}
