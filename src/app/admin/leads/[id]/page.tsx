import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LEAD_STATUS } from "@/lib/auth";
import { updateLeadStatus, addFollowup } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: Number(params.id) },
    include: { followups: { orderBy: { createdAt: "desc" } } },
  });
  if (!lead) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-ink">客户详情</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="text-slate-400">称呼：</span>{lead.name}</p>
          <p><span className="text-slate-400">电话：</span>{lead.phone}</p>
          <p><span className="text-slate-400">公司：</span>{lead.company || "—"}</p>
          <p><span className="text-slate-400">城市：</span>{lead.city || "—"}</p>
          <p><span className="text-slate-400">行业：</span>{lead.industry || "—"}</p>
          <p><span className="text-slate-400">需求：</span>{lead.requirements || "—"}</p>
          <p><span className="text-slate-400">来源：</span>{lead.sourcePage}</p>
          <p><span className="text-slate-400">提交时间：</span>{lead.createdAt.toLocaleString("zh-CN")}</p>
        </div>
        {lead.message && <p className="mt-4 text-sm text-slate-600">问题描述：{lead.message}</p>}
        <form action={updateLeadStatus} className="mt-6 flex items-center gap-3">
          <input type="hidden" name="id" value={lead.id} />
          <label className="text-sm text-slate-500">客户状态</label>
          <select name="status" defaultValue={lead.status} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
            {Object.entries(LEAD_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button className="rounded-full bg-ink px-4 py-1.5 text-sm text-white">更新</button>
        </form>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-ink">跟进记录</h2>
        <ul className="mt-4 space-y-3">
          {lead.followups.map((f) => (
            <li key={f.id} className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="text-xs text-slate-400">{f.createdAt.toLocaleString("zh-CN")}</p>
              <p className="mt-1">{f.content}</p>
            </li>
          ))}
        </ul>
        <form action={addFollowup} className="mt-4 flex gap-2">
          <input type="hidden" name="leadId" value={lead.id} />
          <input name="content" required placeholder="记录本次沟通内容…" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" />
          <button className="rounded-full bg-brand px-4 py-2 text-sm text-white">添加</button>
        </form>
      </div>
    </div>
  );
}
