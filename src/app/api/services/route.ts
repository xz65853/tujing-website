import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sort: "asc" },
  });
  return json(
    services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      nameEn: s.nameEn,
      summary: s.summary,
      features: safeJson<string[]>(s.features, []),
    })),
  );
}
