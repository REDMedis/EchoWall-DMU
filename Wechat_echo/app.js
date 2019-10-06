//app.js
const util = require("/utils/util.js");
const api = require('/config/api.js');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  
  globalData: {
    code: null,
    userInfo: null
  }
})