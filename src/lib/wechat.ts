// 微信小程序登录 + 微信支付 v3 封装
//
// 环境变量（在 .env 里配置）：
//   WECHAT_APPID=wx你的小程序appid
//   WECHAT_SECRET=你的小程序secret
//   WECHAT_MCHID=微信支付商户号
//   WECHAT_APIV3_KEY=APIv3 密钥（32 位）
//   WECHAT_SERIAL_NO=商户证书序列号
//   WECHAT_PRIVATE_KEY_PATH=商户私钥 apiclient_key.pem 的绝对路径
//   WECHAT_NOTIFY_URL=https://你的域名/api/wechat/notify

import crypto from "crypto";
import { readFileSync } from "fs";

export const wechatConfig = {
  appid: process.env.WECHAT_APPID || "",
  secret: process.env.WECHAT_SECRET || "",
  mchid: process.env.WECHAT_MCHID || "",
  apiV3Key: process.env.WECHAT_APIV3_KEY || "",
  serialNo: process.env.WECHAT_SERIAL_NO || "",
  notifyUrl: process.env.WECHAT_NOTIFY_URL || "",
};

function privateKey(): string {
  const p = process.env.WECHAT_PRIVATE_KEY_PATH;
  if (!p) throw new Error("WECHAT_PRIVATE_KEY_PATH 未配置");
  return readFileSync(p, "utf8");
}

// 1) code 换 openid
export async function code2Session(code: string) {
  const url =
    `https://api.weixin.qq.com/sns/jscode2session` +
    `?appid=${wechatConfig.appid}&secret=${wechatConfig.secret}` +
    `&js_code=${encodeURIComponent(code)}&grant_type=authorization_code`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.errcode) throw new Error(`微信登录失败: ${data.errmsg}`);
  return data as { openid: string; session_key: string; unionid?: string };
}

// 2) 生成商户订单号
export function genOutTradeNo() {
  const d = new Date();
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  const ts =
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const rand = Math.floor(Math.random() * 1000000);
  return `TJ${ts}${String(rand).padStart(6, "0")}`;
}

// 3) v3 请求签名
function buildAuthorization(method: string, urlPath: string, body: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonce}\n${body}\n`;
  const sign = crypto.sign("sha256", Buffer.from(message), privateKey());
  const signature = sign.toString("base64");
  return (
    `WECHATPAY2-SHA256-RSA2048 ` +
    `mchid="${wechatConfig.mchid}",` +
    `nonce_str="${nonce}",` +
    `timestamp="${timestamp}",` +
    `serial_no="${wechatConfig.serialNo}",` +
    `signature="${signature}"`
  );
}

// 4) v3 JSAPI 下单，返回小程序 wx.requestPayment 所需参数
export async function createJsapiOrder(params: {
  outTradeNo: string;
  openid: string;
  amount: number; // 单位：分
  description: string;
}) {
  const urlPath = "/v3/pay/transactions/jsapi";
  const body = JSON.stringify({
    appid: wechatConfig.appid,
    mchid: wechatConfig.mchid,
    description: params.description,
    out_trade_no: params.outTradeNo,
    notify_url: wechatConfig.notifyUrl,
    amount: { total: params.amount, currency: "CNY" },
    payer: { openid: params.openid },
  });
  const auth = buildAuthorization("POST", urlPath, body);
  const res = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth,
    },
    body,
  });
  const data = await res.json();
  if (!data.prepay_id) throw new Error(`微信下单失败: ${JSON.stringify(data)}`);

  // 组装小程序支付参数
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = crypto.randomBytes(16).toString("hex");
  const packageStr = `prepay_id=${data.prepay_id}`;
  const paySignMessage = `${wechatConfig.appid}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`;
  const paySign = crypto.sign("sha256", Buffer.from(paySignMessage), privateKey()).toString("base64");

  return {
    timeStamp,
    nonceStr,
    package: packageStr,
    signType: "RSA",
    paySign,
  };
}

// 5) 回调资源解密（AEAD_AES_256_GCM）
export function decryptResource(resource: {
  ciphertext: string;
  nonce: string;
  associated_data: string;
}) {
  const authTag = Buffer.from(resource.ciphertext.slice(-16), "base64");
  const data = Buffer.from(resource.ciphertext.slice(0, -16), "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(wechatConfig.apiV3Key),
    Buffer.from(resource.nonce),
  );
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(resource.associated_data));
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
}
