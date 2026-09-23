"use client";

import { useFormState as useActionState } from "react-dom";
import { loginAction } from "@/lib/admin-actions";

const initial = { error: "" };

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-6">
      <form action={action} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-xl font-bold text-ink">途鲸管理后台</h1>
        <p className="mt-1 text-sm text-slate-500">请登录后管理内容与客户线索</p>
        <label className="mt-6 block">
          <span className="text-sm text-slate-600">用户名</span>
          <input name="username" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" />
        </label>
        <label className="mt-4 block">
          <span className="text-sm text-slate-600">密码</span>
          <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" />
        </label>
        {state.error && <p className="mt-3 text-sm text-rose-600">{state.error}</p>}
        <button disabled={pending} className="mt-6 w-full rounded-full bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "登录中…" : "登录"}
        </button>
      </form>
    </div>
  );
}
