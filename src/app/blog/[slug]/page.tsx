import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!a) return {};
  return { title: a.seoTitle || a.title, description: a.seoDesc || a.summary || "" };
}

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
  const a = await prisma.article.findUnique({ where: { slug: params.slug }, include: { category: true } });
  if (!a || a.status !== "published") notFound();
  return (
    <article className="container-x max-w-3xl py-20">
      <p className="text-sm text-slate-400">{a.category?.name} · {a.publishedAt?.toLocaleDateString("zh-CN")}</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">{a.title}</h1>
      <div className="prose mt-8 leading-8 text-slate-700 whitespace-pre-line">{a.content}</div>
    </article>
  );
}
