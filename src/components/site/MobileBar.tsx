"use client";

import Link from "next/link";

export default function MobileBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white md:hidden">
      {[
        { href: "/", label: "首页" },
        { href: "/services", label: "服务" },
        { href: "/cases", label: "案例" },
        { href: "/contact", label: "咨询", highlight: true },
      ].map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`py-3 text-center text-xs ${
            i.highlight ? "font-semibold text-brand" : "text-slate-600"
          }`}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
