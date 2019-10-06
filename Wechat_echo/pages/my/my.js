const app = getApp()
const api = require("../../config/api.js");
const util = require("../../utils/util.js");

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    sk: null,
    open_id: null
  },
  //事件处理函数
  bindViewTap: function() {

  },



  onLoad: function() {
    var url = api.loginUrl;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 检测本地缓存中是否有 sk 
    if (wx.getStorageSync('sk')) {
      // 检查 sessionkey 是否过期
      wx.checkSession({
        // 没过期，可以通过 sk 和 openid 向服务器请求数据
        success: res => {
          var sk = wx.getStorageSync('sk');
          var open_id = wx.getStorageSync('open_id');
          console.log("yeah");
          console.log(sk, open_id);
          this.setData({
            sk: sk,
            open_id: open_id
          });
        },
        fail: res => {
          wx.login({
            success: res => {

            }
          })
        }
      })
    }
    // 首次登陆，没有 sk
    else {
      var sk, open_id;
      // 获取信息，登陆服务器
      wx.getUserInfo({
        success: res => {
          this.echoLogin(url, res.userInfo).then(function(res) {
            sk = res.sk;
            open_id = res.userInfo.openid;
            wx.setStorageSync('sk', sk);
            wx.setStorageSync('open_id', open_id);
          })
        }
      })

    }


  },
  // 登陆到服务器，返回值为 sk
  echoLogin: function(url, userInfo) {
    return new Promise(function(resolve, reject) {
      var sk;
      wx.login({
        success: res => {
          var data = {
            "code": res.code,
            "userInfo": userInfo
          }
          util.request(url, data, 'POST').then(function(res) {
            resolve(res);
          })
        }
      })
    });
  },


  getUserInfo: function(e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },



})