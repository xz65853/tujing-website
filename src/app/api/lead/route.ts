import { z } from "zod";
import { prisma } from "@/lib/db";
import { json } from "@/lib/api-helper";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const schema = z.object({
    name: z.string().min(1, "请填写称呼").max(20),
    phone: z.string().regex(/^1[3-9]\d{9}$/, "请填写正确的手机号"),
    company: z.string().max(50).optional().default(""),
    city: z.string().max(20).optional().default(""),
    industry: z.string().max(20).optional().default(""),
    requirements: z.string().optional().default(""),
    message: z.string().max(500).optional().default(""),
    source: z.string().optional().default("miniprogram"),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, message: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const d = parsed.data;
  await prisma.lead.create({
    data: {
      name: d.name,
      phone: d.phone,
      company: d.company || null,
      city: d.city || null,
      industry: d.industry || null,
      requirements: d.requirements || null,
      message: d.message || null,
      source: d.source,
      sourcePage: "miniprogram",
      status: "pending",
    },
  });
  return json({ ok: true, message: "提交成功，我们会尽快与您联系" });
}
