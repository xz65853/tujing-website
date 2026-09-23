import Link from "next/link";
import { prisma } from "@/lib/db";
import { safeJson } from "@/lib/utils";
import LeadForm from "@/components/site/LeadForm";

const PAINS = [
  { t: "没有内容", d: "不知道拍什么、怎么拍、怎么持续更新。" },
  { t: "没有运营", d: "账号有人发，但没有明确定位和运营策略。" },
  { t: "没有转化", d: "有播放、有流量，却没有客户。" },
  { t: "不会投放", d: "广告投了，但不知道钱花在哪里、为什么没有结果。" },
];

const WHY = [
  { t: "懂内容", d: "不是简单代发视频，而是围绕客户业务设计内容。" },
  { t: "懂平台", d: "根据抖音等平台规则调整内容与运营方式。" },
  { t: "懂直播", d: "从人货场到直播数据进行系统分析。" },
  { t: "懂获客", d: "不只看播放量，更关注实际业务线索。" },
  { t: "懂实体生意", d: "重点服务实体企业、门店、工厂、电商等真实场景。" },
];

const STEPS = [
  { t: "提交需求", d: "告诉我们你的行业与问题" },
  { t: "沟通业务", d: "深入了解现状与目标" },
  { t: "制定方案", d: "给出可落地的运营方案" },
  { t: "开始执行", d: "内容、直播、投流一起跑起来" },
];

export default async function HomePage() {
  const [services, cases, articles] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, orderBy: { sort: "asc" } }),
    prisma.case.findMany({ where: { status: "published" }, orderBy: { sort: "asc" }, take: 6 }),
    prisma.article.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="container-x grid gap-12 py-24 md:grid-cols-2 md:py-32">
          <div className="reveal">
            <p className="text-sm tracking-widest text-brand-50/80">实体企业线上增长服务商</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              让实体生意，<br />真正做上线上
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              抖音代运营｜短视频｜直播｜本地生活｜广告投放<br />
              为企业提供从内容到获客的一站式线上运营服务。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600">免费获取运营方案</Link>
              <Link href="/cases" className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">查看服务案例</Link>
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-4 self-center md:grid">
            {[["SHORT VIDEO", "短视频内容"], ["DOUYIN", "抖音账号运营"], ["LIVE", "直播运营"], ["LOCAL", "本地生活"], ["ADS", "广告投放"], ["ECOM", "电商运营"]].map(([en, zh]) => (
              <div key={en} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-[11px tracking-widest text-slate-400">{en}</p>
                <p className="mt-2 text-lg font-medium">{zh}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">线上生意做不起来，问题可能不只是流量</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((p) => (
            <div key={p.t} className="rounded-2xl border border-slate-100 bg-surface p-6">
              <h3 className="font-semibold text-ink">{p.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">我们能帮你做什么</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const feats = safeJson<string[]>(s.features, []);
              return (
                <div key={s.id} className="rounded-2xl border border-slate-100 bg-white p-6 transition hover:shadow-md">
                  <p className="text-xs tracking-widest text-brand">{s.nameEn}</p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{s.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{s.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {feats.slice(0, 4).map((f) => (
                      <span key={f} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand">{f}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">为什么选择途鲸</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {WHY.map((w, i) => (
            <div key={w.t}>
              <p className="text-sm font-semibold text-brand">0{i + 1}</p>
              <h3 className="mt-2 font-semibold text-ink">{w.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">我们正在做什么</h2>
            <Link href="/cases" className="text-sm text-brand">查看全部 →</Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <Link key={c.id} href={`/cases/${c.slug}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-ink to-brand text-sm text-white/70">案例封面</div>
                <div className="p-5">
                  <p className="text-xs text-slate-400">{c.industry} · {c.projectType}</p>
                  <h3 className="mt-1 font-semibold text-ink group-hover:text-brand">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{c.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">从了解到合作，只需 4 步</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.t} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand">{i + 1}</div>
              <h3 className="mt-4 font-semibold text-ink">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">运营干货</h2>
            <Link href="/blog" className="text-sm text-brand">查看全部 →</Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`} className="rounded-2xl border border-slate-100 bg-white p-6 transition hover:shadow-md">
                <h3 className="font-semibold text-ink">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{a.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">你的业务，现在遇到了什么问题？</h2>
            <p className="mt-4 leading-7 text-slate-500">告诉我们你的行业和目前遇到的问题，我们会为你整理一份初步的运营思路。</p>
          </div>
          <LeadForm source="/" />
        </div>
      </section>
    </>
  );
}
