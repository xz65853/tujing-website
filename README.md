# 途鲸传媒官网 + 获客管理后台

湖南途鲸文化传媒有限公司官方网站（品牌展示 + 服务/案例/内容 + 客户留资），内置轻量 CRM 后台。

## 技术栈

- **Next.js 14 (App Router)** + **TypeScript**（严格模式）
- **Tailwind CSS**
- **Prisma ORM**
- 开发数据库默认 **SQLite**（零配置），生产可一行切到 **MySQL / PostgreSQL**
- 后台登录：HMAC 签名 Cookie + bcrypt 密码哈希

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 准备环境变量
cp .env.example .env

# 3. 建表 + 写入示例数据与初始管理员
npm run setup

# 4. 启动
npm run dev
```

打开 http://localhost:3000 看前台，http://localhost:3000/admin 进后台。

- 默认管理员：`admin` / `admin123456`（**生产环境请立即修改**）

## 目录结构

```
src/
  app/                  前台与后台路由（App Router）
    actions/leads.ts    前台咨询表单提交
    admin/              管理后台（登录/工作台/线索/案例/服务/文章/Banner/设置）
  components/site/      前台共享组件（导航/页脚/移动端栏/表单）
  lib/
    db.ts               Prisma 客户端
    auth.ts             登录/会话/密码哈希
    admin-actions.ts    后台所有 Server Actions
  prisma/schema.prisma  数据模型
  prisma/seed.ts        种子数据
```

## 切换到 MySQL（生产）

1. 编辑 `prisma/schema.prisma`，把 `provider = "sqlite"` 改成 `provider = "mysql"`；
2. 在 `.env` 里填 `DATABASE_URL="mysql://user:password@host:3306/tujing"`；
3. 执行 `npx prisma db push` 重新建表，并跑一次 `npm run db:seed`。

## 核心业务闭环

用户访问前台 → 查看服务/案例 → 提交咨询表单 → 线索入库 → 管理员登录 `/admin`
→ 查看客户 → 修改状态（待联系/已联系/意向/已报价/已成交/无效）→ 添加跟进记录。

管理员还可在后台维护案例、服务、文章、Banner 与站点 SEO/公司信息，前台自动更新。

## 已按 PRD 落实的要点

- 获客型首页（Hero / 痛点 / 服务 / 为什么选择 / 案例 / 4 步流程 / 干货 / 表单）
- 手机端底部固定导航（首页/服务/案例/咨询高亮）
- 案例"数据展示开关"——无核实数据时前台不展示数据，避免虚假宣传
- 线索来源页面记录 + 同手机号 60 秒防重复提交
- 主色 `#0B1220 / #155EEF / #2563EB`，克制动画，响应式

## 生产部署建议

- 把 `AUTH_SECRET` 换成随机长串；
- 修改或新增管理员账号（直接在数据库 `Admin` 表用 bcrypt 哈希写入）；
- 图片/视频量大时接入 OSS/COS，替换本地媒体上传；
- 上线前在 `网站设置` 填 ICP 备案号与真实联系方式。

## V1 暂不包含（按 PRD 明确排除）

在线支付、在线合同、复杂权限矩阵、App/小程序、AI 自动报价/客服等。
