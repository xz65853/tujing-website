import Link from "next/link";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/services", label: "服务" },
  { href: "/cases", label: "案例" },
  { href: "/blog", label: "运营干货" },
  { href: "/about", label: "关于我们" },
  { href: "/contact", label: "联系我们" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">鲸</span>
          <span className="text-base font-semibold tracking-tight text-ink">途鲸文化传媒</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-slate-600 transition hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-brand md:inline-flex"
        >
          免费获取运营方案
        </Link>
      </div>
    </header>
  );
}
