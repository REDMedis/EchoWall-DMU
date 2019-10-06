// pages/context/context.js
// 引入 request
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//日期格式化工具
const moment = require('../../utils/moment.js')

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //单个页面数据格式为 json 
    echowall: {},
  },

  getData(){
    //取出缓存中的数据
    const id = wx.getStorageSync('id');
    const url = api.contextUrl;
    // request data by GET
    util.request(url, { id }).then(res => {
      //初始化数据
      this.setData({
        echowall: res.data[0],
      }, () => {
        this.resetTitleBackHeight();
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.resetTitleBackHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  resetTitleBackHeight: function () {
    const query = wx.createSelectorQuery();
    if (this.data.echowall.title.length > 10)
      this.setData({
        back_height: 300 + 'rpx'
      })
  }
})