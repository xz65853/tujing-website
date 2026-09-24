import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import { json } from "@/lib/api-helper";

export const dynamic = "force-dynamic";

// GET /api/home  小程序首页聚合数据
export async function GET() {
  const [settings, services, cases, articles, products] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.service.findMany({ where: { published: true }, orderBy: { sort: "asc" }, take: 6 }),
    prisma.case.findMany({ where: { status: "published" }, orderBy: { sort: "asc" }, take: 6 }),
    prisma.article.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 5 }),
    prisma.product.findMany({ where: { published: true }, orderBy: { sort: "asc" }, take: 6 }),
  ]);

  return json({
    company: {
      name: settings?.companyName,
      slogan: settings?.slogan,
      description: settings?.description,
      phone: settings?.phone,
      address: settings?.address,
    },
    services: services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      nameEn: s.nameEn,
      summary: s.summary,
      features: safeJson<string[]>(s.features, []),
    })),
    cases: cases.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      industry: c.industry,
      projectType: c.projectType,
      summary: c.summary,
      cover: c.cover,
    })),
    articles: articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      cover: a.cover,
      publishedAt: a.publishedAt,
    })),
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle,
      cover: p.cover,
      price: p.price,
      originalPrice: p.originalPrice,
      duration: p.duration,
      summary: p.summary,
    })),
  });
}
