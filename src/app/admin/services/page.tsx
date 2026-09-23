import { prisma } from "@/lib/db";
import { saveService } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
  const services = await prisma.service.findMany({ orderBy: { sort: "asc" } });
  return (
    <div>
      <h1 className="text-xl font-bold text-ink">服务管理</h1>
      <div className="mt-6 space-y-4">
        {services.map((s) => (
          <form key={s.id} action={saveService} className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <input type="hidden" name="id" value={s.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" defaultValue={s.name} className="rounded-lg border border-slate-200 px-3 py-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="published" defaultChecked={s.published} /> 前台显示
              </label>
            </div>
            <input name="summary" defaultValue={s.summary || ""} placeholder="一句话简介" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <textarea name="description" rows={2} defaultValue={s.description || ""} placeholder="详细介绍" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
            <button className="mt-3 rounded-full bg-ink px-4 py-1.5 text-white">保存</button>
          </form>
        ))}
      </div>
    </div>
  );
}
