"use client";

import { useFormState as useActionState } from "react-dom";
import { createLead, type LeadFormState } from "@/app/actions/leads";

const REQS = ["抖音代运营", "短视频", "直播", "本地生活", "广告投放", "电商运营", "其他"];
const INDUSTRIES = ["餐饮", "茶叶", "工厂", "汽车", "装修", "电商", "其他"];

const initial: LeadFormState = { ok: false, message: "" };

export default function LeadForm({ source = "/" }: { source?: string }) {
  const [state, action, pending] = useActionState(createLead, initial);

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="sourcePage" value={source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-600">称呼 *</span>
          <input name="name" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" placeholder="您的称呼" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">手机号 *</span>
          <input name="phone" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" placeholder="用于接收方案" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">公司 / 品牌</span>
          <input name="company" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" placeholder="选填" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">所在城市</span>
          <input name="city" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" placeholder="选填" />
        </label>
      </div>

      <div>
        <span className="text-sm text-slate-600">所属行业</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {INDUSTRIES.map((t) => (
            <label key={t} className="cursor-pointer text-xs text-slate-600">
              <input type="radio" name="industry" value={t} className="mr-1" />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="text-sm text-slate-600">希望了解</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {REQS.map((r) => (
            <label key={r} className="cursor-pointer text-xs text-slate-600">
              <input type="checkbox" name="requirements" value={r} className="mr-1" />
              {r}
            </label>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm text-slate-600">目前最大的运营问题</span>
        <textarea name="message" rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" placeholder="例如：有账号但不知道拍什么、直播没成交、投放没效果" />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "提交中…" : "提交需求"}
      </button>

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p>
      )}
    </form>
  );
}
