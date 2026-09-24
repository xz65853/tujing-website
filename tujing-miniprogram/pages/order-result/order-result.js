const { request } = require("../../utils/request");
Page({
  data: { order: null, paid: false },
  onLoad(q) {
    this.setData({ paid: q.paid === "1" });
    request(`/api/order/${q.id}`).then((order) => this.setData({ order }));
  },
  goHome() { wx.switchTab({ url: "/pages/index/index" }); },
  goOrders() { wx.redirectTo({ url: "/pages/orders/orders" }); },
});
