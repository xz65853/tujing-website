import { prisma } from "@/lib/db";
import LeadForm from "@/components/site/LeadForm";

export const metadata = { title: "联系我们" };

export default async function ContactPage() {
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return (
    <div className="container-x py-20">
      <h1 className="text-3xl font-bold text-ink">联系我们</h1>
      <p className="mt-3 text-slate-500">填写下面的表单，我们会在工作时间尽快与你联系。</p>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-sm text-slate-600">
          {s?.phone && <p>电话：{s.phone}</p>}
          {s?.email && <p>邮箱：{s.email}</p>}
          {s?.address && <p>地址：{s.address}</p>}
        </div>
        <LeadForm source="/contact" />
      </div>
    </div>
  );
}
