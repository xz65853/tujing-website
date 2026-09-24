const app = getApp();
Page({
  data: { member: null },
  onShow() {
    this.setData({ member: app.globalData.member });
  },
  async login() {
    const token = await app.silentLogin();
    if (token) {
      this.setData({ member: app.globalData.member });
      wx.showToast({ title: "登录成功", icon: "success" });
    } else {
      wx.showToast({ title: "登录失败", icon: "none" });
    }
  },
  goOrders() { wx.navigateTo({ url: "/pages/orders/orders" }); },
  goContact() { wx.switchTab({ url: "/pages/contact/contact" }); },
  goProducts() { wx.switchTab({ url: "/pages/products/products" }); },
});
