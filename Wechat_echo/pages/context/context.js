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

  getData: function(){
    //取出缓存中的数据
    var id = wx.getStorageSync('id');
    let that = this;
    var url = api.contextUrl + "id=" + id;
    util.request(url).then(function (res) {
      //遍历 json 来格式化时间数据
      for (var index in res.data) {
        var time = moment(res.data[index].time).format('YYYY-MM-DD HH:mm');
        res.data[index].time = time;
      }
      //初始化数据
      that.setData({
        echowall: res.data[0],
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    console.log(this.data.echowall);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})