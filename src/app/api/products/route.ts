import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { sort: "asc" },
  });
  return json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle,
      cover: p.cover,
      price: p.price,
      originalPrice: p.originalPrice,
      duration: p.duration,
      summary: p.summary,
      features: safeJson<string[]>(p.features, []),
    })),
  );
}
