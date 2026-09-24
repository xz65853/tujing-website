const { request } = require("../../utils/request");
const app = getApp();

const STATUS = { pending: "待支付", paid: "已支付", delivered: "已交付", completed: "已完成", refunded: "已退款", closed: "已关闭" };

Page({
  data: { orders: [], loading: true },
  onShow() { this.load(); },
  async load() {
    await app.silentLogin();
    try {
      const orders = await request("/api/orders");
      this.setData({ orders: orders.map((o) => ({ ...o, statusText: STATUS[o.status] || o.status })), loading: false });
    } catch (e) {
      this.setData({ loading: false });
    }
  },
});
