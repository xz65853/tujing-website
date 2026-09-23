import { prisma } from "@/lib/db";
import { saveBanner } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminBanners() {
  const banners = await prisma.banner.findMany({ orderBy: { sort: "asc" } });
  return (
    <div>
      <h1 className="text-xl font-bold text-ink">Banner 管理</h1>
      <div className="mt-6 space-y-4">
        {banners.map((b) => (
          <form key={b.id} action={saveBanner} className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <input type="hidden" name="id" value={b.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="title" defaultValue={b.title || ""} placeholder="标题" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="subtitle" defaultValue={b.subtitle || ""} placeholder="副标题" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="buttonText" defaultValue={b.buttonText || ""} placeholder="按钮文字" className="rounded-lg border border-slate-200 px-3 py-2" />
              <input name="buttonLink" defaultValue={b.buttonLink || ""} placeholder="按钮链接" className="rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={b.active} /> 启用</label>
              <button className="rounded-full bg-ink px-4 py-1.5 text-white">保存</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
