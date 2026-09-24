const { request } = require("../../utils/request");
Page({
  data: { detail: null, loading: true },
  onLoad(q) {
    request(`/api/services/${q.slug}`).then((detail) => {
      this.setData({ detail, loading: false });
      wx.setNavigationBarTitle({ title: detail.name });
    }).catch(() => this.setData({ loading: false }));
  },
  goContact() { wx.switchTab({ url: "/pages/contact/contact" }); },
});
