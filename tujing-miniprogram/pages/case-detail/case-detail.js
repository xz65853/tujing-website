const { request } = require("../../utils/request");
Page({
  data: { detail: null, loading: true },
  onLoad(q) {
    request(`/api/cases/${q.slug}`).then((detail) => {
      this.setData({ detail, loading: false });
      wx.setNavigationBarTitle({ title: detail.title });
    }).catch(() => this.setData({ loading: false }));
  },
});
