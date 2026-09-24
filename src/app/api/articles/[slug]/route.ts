import { prisma } from "@/lib/db";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const a = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!a || a.status !== "published") return json({ error: "not found" }, { status: 404 });
  return json({
    id: a.id,
    title: a.title,
    summary: a.summary,
    content: a.content,
    author: a.author,
    publishedAt: a.publishedAt,
  });
}
