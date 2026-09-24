const { request } = require("../../utils/request");
const app = getApp();

Page({
  data: { name: "", phone: "", company: "", message: "", submitting: false, company: {} },
  onLoad() { this.setData({ company: app.globalData.company || {} }); },
  onName(e) { this.setData({ name: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onCompany(e) { this.setData({ company: e.detail.value }); },
  onMessage(e) { this.setData({ message: e.detail.value }); },

  async submit() {
    if (!this.data.name.trim()) return wx.showToast({ title: "请填写称呼", icon: "none" });
    if (!/^1[3-9]\d{9}$/.test(this.data.phone)) return wx.showToast({ title: "请填写正确手机号", icon: "none" });
    this.setData({ submitting: true });
    try {
      const res = await request("/api/lead", {
        method: "POST",
        data: {
          name: this.data.name,
          phone: this.data.phone,
          company: this.data.company,
          message: this.data.message,
          source: "miniprogram",
        },
      });
      wx.showModal({ title: "提交成功", content: res.message || "我们会尽快与您联系", showCancel: false });
      this.setData({ name: "", phone: "", company: "", message: "" });
    } catch (e) {
      wx.showToast({ title: e.message || "提交失败", icon: "none" });
    } finally {
      this.setData({ submitting: false });
    }
  },

  callPhone() {
    if (this.data.company.phone) wx.makePhoneCall({ phoneNumber: this.data.company.phone });
  },
});
