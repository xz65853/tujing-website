import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveCase, deleteCase } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function EditCase({ params }: { params: { id: string } }) {
  const c = await prisma.case.findUnique({ where: { id: Number(params.id) } });
  if (!c) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-ink">编辑案例</h1>
      <form action={saveCase} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm">
        <input type="hidden" name="id" value={c.id} />
        <input name="title" defaultValue={c.title} required className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <input name="slug" defaultValue={c.slug} required className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="subtitle" defaultValue={c.subtitle || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <input name="industry" defaultValue={c.industry || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <input name="projectType" defaultValue={c.projectType || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="summary" rows={2} defaultValue={c.summary || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="background" rows={3} defaultValue={c.background || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="strategy" rows={3} defaultValue={c.strategy || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="execution" rows={3} defaultValue={c.execution || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="result" rows={3} defaultValue={c.result || ""} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><input type="checkbox" name="dataVisible" defaultChecked={c.dataVisible} /> 展示项目数据</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={c.featured} /> 首页推荐</label>
        </div>
        <div className="flex gap-4">
          <select name="status" defaultValue={c.status} className="rounded-lg border border-slate-200 px-3 py-2">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
            <option value="archived">下架</option>
          </select>
          <button className="rounded-full bg-brand px-6 py-2 text-white">保存</button>
        </div>
      </form>
      <form action={deleteCase} className="mt-4">
        <input type="hidden" name="id" value={c.id} />
        <button className="text-sm text-rose-600">删除此案例</button>
      </form>
    </div>
  );
}
