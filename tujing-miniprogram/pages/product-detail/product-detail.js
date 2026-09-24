const { request } = require("../../utils/request");
Page({
  data: { detail: null, loading: true },
  onLoad(q) {
    request(`/api/products/${q.id}`).then((detail) => {
      this.setData({ detail, loading: false });
      wx.setNavigationBarTitle({ title: detail.name });
    }).catch(() => this.setData({ loading: false }));
  },
  buy() {
    wx.navigateTo({ url: `/pages/order-confirm/order-confirm?id=${this.data.detail.id}` });
  },
});
