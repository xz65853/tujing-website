const { request } = require("../../utils/request");
const app = getApp();

Page({
  data: {
    product: null,
    contactName: "",
    contactPhone: "",
    remark: "",
    submitting: false,
  },

  onLoad(q) {
    this.productId = q.id;
    request(`/api/products/${q.id}`).then((product) => this.setData({ product }));
  },

  onName(e) { this.setData({ contactName: e.detail.value }); },
  onPhone(e) { this.setData({ contactPhone: e.detail.value }); },
  onRemark(e) { this.setData({ remark: e.detail.value }); },

  async submit() {
    if (this.data.submitting) return;
    if (!this.data.contactName.trim()) return wx.showToast({ title: "请填写称呼", icon: "none" });
    if (!/^1[3-9]\d{9}$/.test(this.data.contactPhone)) return wx.showToast({ title: "请填写正确手机号", icon: "none" });

    this.setData({ submitting: true });
    await app.silentLogin();

    try {
      const res = await request("/api/order", {
        method: "POST",
        data: {
          productId: Number(this.productId),
          contactName: this.data.contactName,
          contactPhone: this.data.contactPhone,
          remark: this.data.remark,
        },
      });

      if (!res.payParams) {
        wx.showModal({
          title: "订单已创建",
          content: res.message || "支付通道未配置，请联系客服",
          showCancel: false,
          success: () => wx.redirectTo({ url: `/pages/order-result/order-result?id=${res.orderId}` }),
        });
        return;
      }

      // 调起微信支付
      wx.requestPayment({
        timeStamp: res.payParams.timeStamp,
        nonceStr: res.payParams.nonceStr,
        package: res.payParams.package,
        signType: "RSA",
        paySign: res.payParams.paySign,
        success: () => {
          wx.redirectTo({ url: `/pages/order-result/order-result?id=${res.orderId}&paid=1` });
        },
        fail: () => {
          wx.redirectTo({ url: `/pages/order-result/order-result?id=${res.orderId}&paid=0` });
        },
      });
    } catch (e) {
      wx.showToast({ title: e.error || "下单失败", icon: "none" });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
