import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!s || !s.published) return json({ error: "not found" }, { status: 404 });
  return json({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    summary: s.summary,
    description: s.description,
    features: safeJson<string[]>(s.features, []),
    audience: s.audience,
  });
}
