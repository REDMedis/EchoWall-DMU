// pages/data/data.js
// 引入 request
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//日期格式化工具
const moment = require('../../utils/moment.js')
const app = getApp();
var page = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //默认请求回传值为 json 数组
    echowall: [{}],
  },
  //数据写入缓存来进行页面间通信
  itemTap: function (event){
    var id = event.currentTarget.dataset.id;
    wx.setStorageSync('id', id);
    wx.navigateTo({
      url: '/pages/context/context',
    })
  },
  //get并初始化数据
  getIndexData: function (){
    let that = this;
    var url = api.listUrl + "?page=" + page;
    util.request(url).then(function (res){
      //遍历 json 来格式化时间数据
      for (var index in res.data){
        var time = moment(res.data[index].time).format('YYYY-MM-DD HH:mm');
        res.data[index].time = time;
      }
      //初始化数据
      that.setData({
        echowall: res.data,
      });
    });
  },

  //下拉页面增加数据
  addData: function(){
    page ++;
    let that = this;
    var url = api.listUrl + "?page=" + page;
    //获取当前数据值
    var data = that.data.echowall;
    util.request(url).then(function (res) {
      //遍历 json 来格式化时间数据，并且完成数据拼接
      for (var index in res.data) {
        var time = moment(res.data[index].time).format('YYYY-MM-DD HH:mm');
        res.data[index].time = time;
        //数据拼接
        data.push(res.data[index]);
      }
      //数据传递
      that.setData({
        echowall: data,
      });
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.addData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})