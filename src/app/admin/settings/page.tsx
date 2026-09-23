import { prisma } from "@/lib/db";
import { saveSettings } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-ink">网站设置</h1>
      <form action={saveSettings} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm">
        <input name="companyName" defaultValue={s?.companyName} placeholder="公司名称" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <input name="slogan" defaultValue={s?.slogan || ""} placeholder="品牌定位" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="description" rows={2} defaultValue={s?.description || ""} placeholder="公司简介" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="phone" defaultValue={s?.phone || ""} placeholder="联系电话" className="rounded-lg border border-slate-200 px-3 py-2" />
          <input name="email" defaultValue={s?.email || ""} placeholder="邮箱" className="rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <input name="address" defaultValue={s?.address || ""} placeholder="公司地址" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <input name="icp" defaultValue={s?.icp || ""} placeholder="ICP 备案号" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <div className="border-t border-slate-100 pt-4">
          <h2 className="font-semibold text-ink">SEO</h2>
          <input name="siteTitle" defaultValue={s?.siteTitle || ""} placeholder="网站 Title" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <textarea name="siteDesc" rows={2} defaultValue={s?.siteDesc || ""} placeholder="网站 Description" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <input name="siteKeywords" defaultValue={s?.siteKeywords || ""} placeholder="网站 Keywords" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <button className="rounded-full bg-brand px-6 py-2 text-white">保存设置</button>
      </form>
    </div>
  );
}
