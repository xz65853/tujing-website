import { prisma } from "@/lib/db";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  return json(
    articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      cover: a.cover,
      author: a.author,
      publishedAt: a.publishedAt,
    })),
  );
}
