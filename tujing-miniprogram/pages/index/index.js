const { request } = require("../../utils/request");
const app = getApp();

Page({
  data: {
    company: {},
    services: [],
    cases: [],
    articles: [],
    products: [],
    loading: true,
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (!app.globalData.token) app.silentLogin();
  },

  async loadData() {
    try {
      const data = await request("/api/home");
      this.setData({
        company: data.company || {},
        services: data.services || [],
        cases: data.cases || [],
        articles: data.articles || [],
        products: data.products || [],
        loading: false,
      });
      app.globalData.company = data.company;
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: "加载失败", icon: "none" });
    }
  },

  goService(e) {
    wx.navigateTo({ url: `/pages/service-detail/service-detail?slug=${e.currentTarget.dataset.slug}` });
  },
  goCase(e) {
    wx.navigateTo({ url: `/pages/case-detail/case-detail?slug=${e.currentTarget.dataset.slug}` });
  },
  goArticle(e) {
    wx.navigateTo({ url: `/pages/article-detail/article-detail?slug=${e.currentTarget.dataset.slug}` });
  },
  goProduct(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/product-detail/product-detail?id=${id}` });
  },
  goProducts() {
    wx.switchTab({ url: "/pages/products/products" });
  },
  goContact() {
    wx.switchTab({ url: "/pages/contact/contact" });
  },
  callPhone() {
    if (this.data.company.phone) {
      wx.makePhoneCall({ phoneNumber: this.data.company.phone });
    }
  },
});
