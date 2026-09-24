import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 站点设置（单例）
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "湖南途鲸文化传媒有限公司",
      slogan: "实体企业线上增长服务商",
      description:
        "围绕抖音代运营、短视频、直播、本地生活、广告投放及电商运营，为实体企业提供线上内容、流量与获客解决方案。",
      phone: "0737-000-0000",
      email: "hello@example.com",
      address: "湖南省益阳市（示例地址，请到后台修改）",
      siteTitle: "途鲸传媒｜抖音代运营·短视频·直播·本地生活获客服务商",
      siteDesc: "湖南途鲸文化传媒有限公司，帮助实体企业把生意搬到线上。抖音代运营、短视频、直播、本地生活、广告投放一站式服务。",
      siteKeywords: "抖音代运营,短视频运营,直播运营,本地生活,广告投放,湖南传媒公司",
    },
  });

  // 初始管理员
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, passwordHash, name: "超级管理员", role: "SUPER_ADMIN" },
  });

  // 服务分类与服务
  const ops = await prisma.serviceCategory.upsert({ where: { slug: "operation" }, update: {}, create: { name: "线上运营", slug: "operation", sort: 1 } });
  const ads = await prisma.serviceCategory.upsert({ where: { slug: "ads" }, update: {}, create: { name: "广告投放", slug: "ads", sort: 2 } });

  const services = [
    { name: "抖音代运营", slug: "douyin-operation", nameEn: "DOUYIN", summary: "从账号定位、内容策划、拍摄剪辑到直播投流、数据复盘，全流程托管。", features: ["账号定位", "内容策划", "短视频制作", "账号运营", "数据分析", "持续优化"], categoryId: ops.id, sort: 1 },
    { name: "短视频运营", slug: "short-video", nameEn: "VIDEO", summary: "选题、脚本、拍摄、剪辑、发布、数据复盘的完整内容流水线。", features: ["选题", "脚本", "拍摄", "剪辑", "发布", "数据复盘"], categoryId: ops.id, sort: 2 },
    { name: "直播运营", slug: "live", nameEn: "LIVE", summary: "直播间搭建、主播培训、脚本、选品排品、投流与复盘。", features: ["直播间搭建", "主播培训", "直播脚本", "选品排品", "直播运营", "数据复盘"], categoryId: ops.id, sort: 3 },
    { name: "本地生活", slug: "local-business", nameEn: "LOCAL", summary: "团购搭建、门店短视频、达人合作、直播团购与广告投放。", features: ["团购运营", "门店内容", "短视频", "直播团购", "达人合作", "广告投放"], categoryId: ops.id, sort: 4 },
    { name: "广告投放", slug: "advertising", nameEn: "ADS", summary: "抖音广告、巨量引擎、千川、本地推广、朋友圈与小红书投放。", features: ["抖音广告", "巨量引擎", "千川", "本地推广", "朋友圈广告", "小红书"], categoryId: ads.id, sort: 5 },
    { name: "电商运营", slug: "ecommerce", nameEn: "ECOM", summary: "账号、商品内容、直播带货、短视频带货、投流与数据分析。", features: ["账号运营", "商品内容", "直播带货", "短视频带货", "投流", "数据分析"], categoryId: ops.id, sort: 6 },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: { ...s, features: JSON.stringify(s.features) } });
  }

  // 案例分类与案例
  const cc1 = await prisma.caseCategory.upsert({ where: { slug: "douyin" }, update: {}, create: { name: "抖音运营", slug: "douyin", sort: 1 } });
  const cc2 = await prisma.caseCategory.upsert({ where: { slug: "local" }, update: {}, create: { name: "本地生活", slug: "local", sort: 2 } });
  const cc3 = await prisma.caseCategory.upsert({ where: { slug: "ecom" }, update: {}, create: { name: "电商", slug: "ecom", sort: 3 } });

  await prisma.case.upsert({
    where: { slug: "anhua-ice-moraine" },
    update: {},
    create: {
      title: "安化冰碛岩项目",
      slug: "anhua-ice-moraine",
      subtitle: "茶具 / 文创",
      industry: "茶具文创",
      projectType: "抖音运营 · 直播",
      summary: "围绕安化本地特色物产，搭建账号内容与直播体系。",
      background: "客户拥有安化冰碛岩茶具产品线，但线上几乎没有内容沉淀，缺少稳定的获客渠道。",
      strategy: "以原产地与匠人故事为主线，建立账号人设；用短视频建立认知，用直播承接咨询与成交。",
      execution: "完成账号定位、选题库、拍摄剪辑流水线，并搭建常态化直播节奏。",
      result: "项目已跑通从内容到咨询的链路，具体经营数据由客户后台核实后补充。",
      dataVisible: false,
      featured: true,
      status: "published",
      categoryId: cc1.id,
      metrics: JSON.stringify([]),
      images: JSON.stringify([]),
    },
  });

  await prisma.case.upsert({
    where: { slug: "anhua-dark-tea" },
    update: {},
    create: {
      title: "安化黑茶项目",
      slug: "anhua-dark-tea",
      subtitle: "茶叶",
      industry: "茶叶",
      projectType: "短视频 + 直播 + 商品 + 投流",
      summary: "茶叶品类的内容电商与直播带货尝试。",
      background: "客户有成熟产品，但线上转化薄弱，需要内容与直播结合的运营方式。",
      strategy: "短视频做产品种草与场景展示，直播间做集中转化，投流做精准人群放大。",
      execution: "搭建内容日历、直播排期与投流测试计划，按周复盘调整。",
      result: "形成可复用的内容-直播-投流闭环，数据以客户实际后台为准。",
      dataVisible: false,
      featured: true,
      status: "published",
      categoryId: cc3.id,
      metrics: JSON.stringify([]),
      images: JSON.stringify([]),
    },
  });

  await prisma.case.upsert({
    where: { slug: "local-store" },
    update: {},
    create: {
      title: "本地实体商家",
      slug: "local-store",
      subtitle: "餐饮 / 汽车 / 装修 / 工厂",
      industry: "本地实体",
      projectType: "抖音本地生活 + 短视频 + 团购",
      summary: "帮助本地门店通过短视频与团购获得到店客流。",
      background: "本地商家有门店与产品，但缺乏线上获客能力，客流依赖自然到店。",
      strategy: "门店短视频 + 团购搭建 + 本地投放，把线上流量引导到店。",
      execution: "完成团购配置、门店内容模板与本地投放测试。",
      result: "建立从内容到团购的到店链路，效果依门店实际经营为准。",
      dataVisible: false,
      featured: false,
      status: "published",
      categoryId: cc2.id,
      metrics: JSON.stringify([]),
      images: JSON.stringify([]),
    },
  });

  // 文章分类与示例文章
  const ac = await prisma.articleCategory.upsert({ where: { slug: "douyin-tips" }, update: {}, create: { name: "抖音运营", slug: "douyin-tips" } });
  await prisma.article.upsert({
    where: { slug: "douyin-operation-what-is-it" },
    update: {},
    create: {
      title: "抖音代运营到底在运营什么？",
      slug: "douyin-operation-what-is-it",
      summary: "代运营不是简单代发视频，而是围绕业务目标做定位、内容、数据与转化的系统工程。",
      content: "## 一、定位\n\n先想清楚账号要吸引谁、卖什么、凭什么被记住。\n\n## 二、内容\n\n围绕目标客户的问题做选题，而不是自说自话。\n\n## 三、数据与转化\n\n播放量只是过程指标，真正要盯的是咨询与成交。",
      author: "途鲸内容组",
      publishedAt: new Date(),
      status: "published",
      categoryId: ac.id,
    },
  });

  // 示例套餐（小程序内可直接购买）
  const products = [
    {
      name: "抖音账号诊断",
      subtitle: "1 次深度诊断",
      price: 29900,
      originalPrice: 59900,
      duration: "3 个工作日内交付",
      summary: "账号定位、内容问题、变现路径一次说清，附可执行改进清单。",
      features: JSON.stringify(["账号定位分析", "近 30 条视频诊断", "对标账号拆解", "可执行改进清单", "1 次 30 分钟电话复盘"]),
      detail: "适合已经做了一段时间抖音、但不知道问题出在哪的老板。我们会把你的账号从头到尾看一遍，告诉你哪里不对、怎么改、先做哪三件事。",
      sort: 1,
    },
    {
      name: "短视频月度代运营",
      subtitle: "8 条 / 月",
      price: 499900,
      originalPrice: 699900,
      duration: "1 个月起签",
      summary: "每月 8 条短视频，含选题、脚本、拍摄、剪辑、发布、数据复盘。",
      features: JSON.stringify(["每月 8 条短视频", "选题库共建", "脚本与拍摄", "专业剪辑", "发布与话题", "月度数据复盘"]),
      detail: "适合想稳定更新但没团队的实体企业。你只需要配合出镜或提供素材，剩下的我们来。",
      sort: 2,
    },
    {
      name: "直播试运营包",
      subtitle: "4 场直播",
      price: 399900,
      originalPrice: 599900,
      duration: "2 周内完成",
      summary: "从人货场搭建到 4 场直播跑通，含脚本、复盘与投流建议。",
      features: JSON.stringify(["直播间搭建指导", "主播脚本 4 份", "4 场直播执行", "投流测试建议", "直播数据复盘报告"]),
      detail: "适合没播过、想先小成本试试直播的商家。不承诺 GMV，承诺把流程跑通。",
      sort: 3,
    },
  ];
  for (let i = 0; i < products.length; i++) {
    await prisma.product.upsert({
      where: { id: i + 1 },
      update: {},
      create: products[i],
    });
  }

  console.log("Seed 完成。后台登录：", username, "/", password);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
