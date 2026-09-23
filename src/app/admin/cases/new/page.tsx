import { saveCase } from "@/lib/admin-actions";

export default function NewCase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-ink">新增案例</h1>
      <form action={saveCase} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm">
        <input name="title" placeholder="案例标题 *" required className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <input name="slug" placeholder="URL 标识 *（如 anhua-dark-tea）" required className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="subtitle" placeholder="副标题" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <input name="industry" placeholder="行业（如 茶叶）" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <input name="projectType" placeholder="项目类型（如 抖音运营 · 直播）" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="summary" rows={2} placeholder="一句话简介" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="background" rows={3} placeholder="项目背景" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="strategy" rows={3} placeholder="运营策略" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="execution" rows={3} placeholder="执行内容" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <textarea name="result" rows={3} placeholder="项目结果" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><input type="checkbox" name="dataVisible" /> 展示项目数据（无核实数据请勿开启）</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" /> 首页推荐</label>
        </div>
        <div className="flex gap-4">
          <select name="status" className="rounded-lg border border-slate-200 px-3 py-2">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
            <option value="archived">下架</option>
          </select>
          <button className="rounded-full bg-brand px-6 py-2 text-white">保存</button>
        </div>
      </form>
    </div>
  );
}
