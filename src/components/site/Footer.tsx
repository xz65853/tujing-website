import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Footer() {
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return (
    <footer className="border-t border-slate-100 bg-surface pb-20 md:pb-10">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">鲸</span>
            <span className="text-base font-semibold text-ink">{s?.companyName || "途鲸文化传媒"}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">{s?.description || s?.slogan}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">导航</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li><Link href="/services">服务项目</Link></li>
            <li><Link href="/cases">成功案例</Link></li>
            <li><Link href="/blog">运营干货</Link></li>
            <li><Link href="/about">关于我们</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">联系</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            {s?.phone && <li>电话：{s.phone}</li>}
            {s?.email && <li>邮箱：{s.email}</li>}
            {s?.address && <li>地址：{s.address}</li>}
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-slate-200 pt-5 text-xs text-slate-400">
        © {new Date().getFullYear()} {s?.companyName || "途鲸文化传媒"} 版权所有{s?.icp ? ` · ${s.icp}` : ""}
      </div>
    </footer>
  );
}
