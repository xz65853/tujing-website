# 途鲸传媒官网 + 获客管理后台 + 微信小程序

湖南途鲸文化传媒有限公司官方网站（品牌展示 + 服务/案例/内容 + 客户留资），内置轻量 CRM 后台，并配套原生微信小程序（与官网共用同一套后端数据）。

## 技术栈

- **Next.js 14 (App Router)** + **TypeScript**（严格模式）
- **Tailwind CSS**
- **Prisma ORM**
- 开发数据库默认 **SQLite**（零配置），生产可一行切到 **MySQL / PostgreSQL**
- 后台登录：HMAC 签名 Cookie + bcrypt 密码哈希
- **微信小程序**：原生代码（无框架），通过 `wx.login` 静默登录 + 微信支付 v3

## 仓库结构

```
├── src/                    Next.js 官网 + 后台 + API
│   ├── app/
│   │   ├── (前台页面)        首页/服务/案例/博客/关于/联系
│   │   ├── admin/           管理后台（线索/订单/会员/案例/服务/套餐/文章/Banner/设置）
│   │   └── api/             小程序后端 API（14 个路由）
│   └── lib/
│       ├── wechat.ts         微信登录 + 微信支付 v3 封装
│       └── api-helper.ts      小程序请求鉴权
├── prisma/schema.prisma     数据模型（Admin/Service/Case/Article/Lead/Member/Product/Order...）
├── prisma/seed.ts           种子数据（含 3 个示例套餐）
└── tujing-miniprogram/      微信小程序原生代码
    ├── app.js/json/wxss     全局配置
    ├── utils/request.js      请求封装
    └── pages/               11 个页面（首页/套餐/详情/下单/支付/订单/咨询/我的/服务/案例/文章）
```

## 快速开始（官网）

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

打开 http://localhost:3000 看前台，http://localhost:3000/admin 进后台。

- 默认管理员：`admin` / `admin123456`（生产环境请立即修改）

## 快速开始（小程序）

1. 微信开发者工具 → 导入项目 → 选 `tujing-miniprogram/`
2. 改 `project.config.json` 里的 `appid`
3. 改 `app.js` 里的 `apiBase` 为你的官网域名
4. 真机预览前，先在微信公众平台把域名加到 request 合法域名

## 后台功能

- **客户线索 CRM**：线索入库、状态流转、跟进记录、分配
- **订单管理**（小程序）：已收款合计、订单列表、联系人信息
- **会员管理**（小程序）：微信登录用户列表
- **套餐管理**（小程序）：在线购买套餐 CRUD，价格单位分
- **案例/服务/文章/Banner/网站设置**：前台内容全部可后台维护

## 微信支付配置

在 `.env` 里填：

```
WECHAT_APPID=小程序appid
WECHAT_SECRET=小程序secret
WECHAT_MCHID=微信支付商户号
WECHAT_APIV3_KEY=APIv3密钥
WECHAT_SERIAL_NO=商户证书序列号
WECHAT_PRIVATE_KEY_PATH=/绝对路径/apiclient_key.pem
WECHAT_NOTIFY_URL=https://你的域名/api/wechat/notify
```

没配微信支付也能跑——下单会创建订单但不弹支付，提示"联系客服付款"，订单仍进后台。

## 切换到 MySQL（生产）

1. `prisma/schema.prisma` 把 `provider = "sqlite"` 改成 `provider = "mysql"`
2. `.env` 填 `DATABASE_URL="mysql://user:password@host:3306/tujing"`
3. `npx prisma db push` 重新建表，跑一次 `npm run db:seed`

## 生产部署建议

- `AUTH_SECRET` 换成随机长串
- 修改默认管理员密码
- 图片/视频量大时接 OSS/COS
- 上线前在后台「网站设置」填 ICP 备案号与真实联系方式
- 小程序上线前完成微信备案 + 服务器域名白名单
