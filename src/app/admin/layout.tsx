import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/admin-actions";

const MENU = [
  { href: "/admin", label: "工作台" },
  { href: "/admin/leads", label: "客户线索" },
  { href: "/admin/cases", label: "案例管理" },
  { href: "/admin/services", label: "服务管理" },
  { href: "/admin/articles", label: "文章管理" },
  { href: "/admin/banners", label: "Banner 管理" },
  { href: "/admin/settings", label: "网站设置" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) return <div className="min-h-screen bg-slate-50">{children}</div>;
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-ink text-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold">鲸</span>
          <span className="text-sm font-semibold">途鲸管理后台</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {MENU.map((m) => (
            <Link key={m.href} href={m.href} className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">{m.label}</Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action={logoutAction}>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">{admin.name} · 退出</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  );
}
