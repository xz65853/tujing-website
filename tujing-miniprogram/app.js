// 小程序全局配置
App({
  globalData: {
    // 部署后改成你的后端域名（即 Next.js 官网域名）
    apiBase: "https://zzzz.baby",
    token: "",
    member: null,
    company: null,
  },

  onLaunch() {
    const token = wx.getStorageSync("token");
    if (token) this.globalData.token = token;
    const member = wx.getStorageSync("member");
    if (member) this.globalData.member = member;
    // 拉一次首页聚合数据缓存公司信息
    this.fetchHome();
  },

  // 静默登录：wx.login 拿 code 换 token
  silentLogin() {
    return new Promise((resolve) => {
      if (this.globalData.token) return resolve(this.globalData.token);
      wx.login({
        success: (res) => {
          if (!res.code) return resolve(null);
          wx.request({
            url: this.globalData.apiBase + "/api/auth/wechat",
            method: "POST",
            data: { code: res.code },
            success: (r) => {
              if (r.data && r.data.token) {
                this.globalData.token = r.data.token;
                this.globalData.member = r.data.member;
                wx.setStorageSync("token", r.data.token);
                wx.setStorageSync("member", r.data.member);
                resolve(r.data.token);
              } else {
                resolve(null);
              }
            },
            fail: () => resolve(null),
          });
        },
        fail: () => resolve(null),
      });
    });
  },

  fetchHome() {
    wx.request({
      url: this.globalData.apiBase + "/api/home",
      success: (r) => {
        if (r.data && r.data.company) {
          this.globalData.company = r.data.company;
        }
      },
    });
  },
});
