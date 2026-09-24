import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({ where: { id: Number(params.id) } });
  if (!p || !p.published) return json({ error: "not found" }, { status: 404 });
  return json({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    cover: p.cover,
    price: p.price,
    originalPrice: p.originalPrice,
    duration: p.duration,
    summary: p.summary,
    features: safeJson<string[]>(p.features, []),
    detail: p.detail,
  });
}
