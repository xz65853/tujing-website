import { prisma } from "@/lib/db";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const cases = await prisma.case.findMany({
    where: { status: "published" },
    orderBy: { sort: "asc" },
  });
  return json(
    cases.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      industry: c.industry,
      projectType: c.projectType,
      summary: c.summary,
      cover: c.cover,
      featured: c.featured,
    })),
  );
}
