"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

const LeadSchema = z.object({
  name: z.string().min(1, "请填写称呼").max(20),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请填写正确的手机号"),
  company: z.string().max(50).optional().or(z.literal("")),
  city: z.string().max(20).optional().or(z.literal("")),
  industry: z.string().max(20).optional().or(z.literal("")),
  requirements: z.string().optional(),
  message: z.string().max(500).optional().or(z.literal("")),
  sourcePage: z.string().optional(),
});

export type LeadFormState = { ok: boolean; message: string };

export async function createLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = LeadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    company: formData.get("company") || "",
    city: formData.get("city") || "",
    industry: formData.get("industry") || "",
    requirements: formData.get("requirements")
      ? String(formData.get("requirements"))
      : "",
    message: formData.get("message") || "",
    sourcePage: formData.get("sourcePage") || "/",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "信息填写有误" };
  }
  const data = parsed.data;

  const since = new Date(Date.now() - 60 * 1000);
  const recent = await prisma.lead.findFirst({
    where: { phone: data.phone, createdAt: { gte: since } },
  });
  if (recent) {
    return { ok: false, message: "您刚刚提交过，我们会尽快与您联系，请稍候" };
  }

  const hdrs = headers();
  await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      company: data.company || null,
      city: data.city || null,
      industry: data.industry || null,
      requirements: data.requirements || null,
      message: data.message || null,
      source: hdrs.get("referer") || "web",
      sourcePage: data.sourcePage,
      status: "pending",
    },
  });

  return { ok: true, message: "提交成功，我们会尽快与您联系。" };
}
