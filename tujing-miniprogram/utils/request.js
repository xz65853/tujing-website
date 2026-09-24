// 封装请求，自动带 token
const app = getApp();

function request(path, options = {}) {
  const base = app.globalData.apiBase;
  return new Promise((resolve, reject) => {
    wx.request({
      url: base + path,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        "x-token": app.globalData.token || "",
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data);
        else reject(res.data || { error: "请求失败" });
      },
      fail: (err) => reject(err),
    });
  });
}

module.exports = { request };
