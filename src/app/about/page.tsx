import { prisma } from "@/lib/db";

export const metadata = { title: "关于我们" };

export default async function AboutPage() {
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return (
    <div className="container-x py-20">
      <h1 className="text-3xl font-bold text-ink">关于途鲸</h1>
      <div className="mt-8 max-w-3xl leading-8 text-slate-600">
        <p>{s?.companyName || "湖南途鲸文化传媒有限公司"}，专注于企业线上营销与数字化运营服务。</p>
        <p className="mt-4">{s?.description || "围绕抖音代运营、短视频、直播、本地生活、广告投放及电商运营，为实体企业提供线上内容、流量与获客解决方案。"}</p>
        <p className="mt-4">我们不堆砌空洞的企业荣誉，而是用内容、平台与获客结果说话。</p>
      </div>
    </div>
  );
}
