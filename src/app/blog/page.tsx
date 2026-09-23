import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "运营干货" };

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
  return (
    <div className="container-x py-20">
      <h1 className="text-3xl font-bold text-ink">运营干货</h1>
      <p className="mt-3 text-slate-500">抖音运营、直播、本地生活与企业营销的实践笔记。</p>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.id} href={`/blog/${a.slug}`} className="rounded-2xl border border-slate-100 bg-white p-6 transition hover:shadow-md">
            <p className="text-xs text-slate-400">{a.category?.name} · {a.publishedAt?.toLocaleDateString("zh-CN")}</p>
            <h2 className="mt-2 font-semibold text-ink">{a.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{a.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
