import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const c = await prisma.case.findUnique({ where: { slug: params.slug } });
  if (!c || c.status !== "published") return json({ error: "not found" }, { status: 404 });
  return json({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    industry: c.industry,
    projectType: c.projectType,
    summary: c.summary,
    background: c.background,
    strategy: c.strategy,
    execution: c.execution,
    result: c.result,
    dataVisible: c.dataVisible,
    metrics: safeJson<{ label: string; value: string }[]>(c.metrics, []),
    images: safeJson<string[]>(c.images, []),
  });
}
