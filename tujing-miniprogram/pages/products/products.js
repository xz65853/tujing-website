const { request } = require("../../utils/request");
Page({
  data: { products: [], loading: true },
  onLoad() { this.load(); },
  onShow() { this.load(); },
  load() {
    request("/api/products").then((products) => this.setData({ products, loading: false }))
      .catch(() => this.setData({ loading: false }));
  },
  goDetail(e) {
    wx.navigateTo({ url: `/pages/product-detail/product-detail?id=${e.currentTarget.dataset.id}` });
  },
});
