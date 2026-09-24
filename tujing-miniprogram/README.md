# 途鲸传媒微信小程序

与官网（Next.js）共用同一套后端数据和后台管理。

## 功能

- 首页：公司介绍、服务列表、案例、文章、套餐入口
- 服务套餐：展示可在线购买的服务包，微信支付下单
- 案例 / 文章：与官网内容同步
- 咨询表单：提交线索进入后台 CRM
- 我的：微信一键登录、我的订单

## 导入微信开发者工具

1. 打开「微信开发者工具」→ 导入项目
2. 选择本目录（`tujing-miniprogram/`）
3. AppID 填你自己的小程序 AppID（在 `project.config.json` 里改）
4. 修改 `app.js` 里的 `apiBase` 为你的官网域名（如 `https://zzzz.baby`）

## 后端需要配置的环境变量

在官网服务器的 `.env` 里填：

```
WECHAT_APPID=你的小程序appid
WECHAT_SECRET=你的小程序secret
WECHAT_MCHID=微信支付商户号
WECHAT_APIV3_KEY=APIv3密钥
WECHAT_SERIAL_NO=商户证书序列号
WECHAT_PRIVATE_KEY_PATH=/绝对路径/apiclient_key.pem
WECHAT_NOTIFY_URL=https://你的域名/api/wechat/notify
```

**没配微信支付也能跑**：套餐页和下单流程正常，只是支付时会提示"支付通道未配置，请联系客服"，订单仍会进入后台。

## 上线前 checklist

- [ ] 在微信公众平台 → 开发管理 → 服务器域名，把你的官网域名加到 `request 合法域名`
- [ ] 小程序本身要做微信备案
- [ ] 微信支付商户号要和小程序 AppID 关联
- [ ] 把商户私钥 `apiclient_key.pem` 上传到服务器，路径填到 `WECHAT_PRIVATE_KEY_PATH`
- [ ] 后台 `/admin/products` 里编辑套餐，确认"小程序上架"已勾选
