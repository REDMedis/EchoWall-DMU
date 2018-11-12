// edit by keith 
// 2018/11/08
// 去除了一个代码重复度过高的方法，现在所有的数据都是拼接而成，初始化时清空之后从头开始拼接
// ------------------------------------------------------------------------------------
// pages/data/data.js
// 引入 request
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//日期格式化工具
const moment = require('../../utils/moment.js')
const app = getApp();
var page = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false, //上划加载判定
    refreshAnimation: {},
    echowall: [], //默认请求回传值为 json 数组
    last_update: util.formatTime(new Date),
    search_status: 0 ,//搜索栏的状态（0: unfocus, 1: focus）
    tabTxt: ['按时间', '按热度'],
    tab: [true, true],
    timeList: [{ 'id': '1', 'title': '所有' }, { 'id': '2', 'title': '近三天' }, { 'id': '3', 'title': '近一周' }],
    time_id: 0,
    time_txt: '',
    popular_id: 0,
    popular_txt: '',
    mailbox_id: 0,
    array: ['所有信箱', '校领导信箱', '后勤保障处信箱', '教务处信箱', '网络信息与综合服务中心信箱', '学生处信箱', '创新创业学院信箱', '财务处信箱', '人事处信箱', '图书馆信箱', '学生就业指导中心', '保卫处信箱', '信息处信箱', '后勤集团', '研究生信箱', '其他'],
    // picker json
    objectArray: [
      {
        id: 0,
        box: '所有信箱'
      },
      {
        id: 1,
        box: '校领导信箱'
      },
      {
        id: 2,
        box: '后勤保障处信箱'
      },
      {
        id: 3,
        box: '教务处信箱'
      },
      {
        id: 4,
        box: '网络信息与综合服务中心信箱'
      },
      {
        id: 5,
        box: '学生处信箱'
      },
      {
        id: 6,
        box: '创新创业学院信箱'
      },
      {
        id: 7,
        box: '财务处信箱'
      },
      {
        id: 8,
        box: '人事处信箱'
      },
      {
        id: 9,
        box: '图书馆信箱'
      },
      {
        id: 10,
        box: '学生就业指导中心'
      },
      {
        id: 11,
        box: '保卫处信箱'
      },
      {
        id: 12,
        box: '信息处信箱'
      },
      {
        id: 13,
        box: '后勤集团'
      },
      {
        id:14,
        box: '研究生信箱'
      },
      {
        id: 15,
        box: '其他'
      }
    ],
    // picked index
    index: 0,
  },
  // picker 触发的监听事件
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    });
    this.resetData();
  },
  //数据写入缓存来进行页面间通信
  itemTap: function (event){
    var id = event.currentTarget.dataset.id;
    wx.setStorageSync('id', id);
    wx.navigateTo({
      url: '/pages/context/context',
    })
  },
  //数据重置
  resetData: function(){
    page = 0;
    this.setData({
      echowall: []
    })
    this.addData();
  },

  // //get并初始化数据
  // getIndexData: function (){
  //   page = 1;
  //   let that = this;
  //   var url = api.listUrl + "?page=" + page;
  //   util.request(url).then(function (res){
  //     //遍历 json 来格式化时间数据
  //     for (var index in res.data){
  //       var time = moment(res.data[index].time).format('YYYY-MM-DD HH:mm');
  //       res.data[index].time = time;
  //     }
  //     //初始化数据
  //     that.setData({
  //       echowall: res.data,
  //       last_update: res.data[0].time
  //     });
  //   });
  // },

  //数据更新
  addData: function(){
    page ++;
    let that = this;
    var url;
    console.log(that.data.index)
    if (that.data.index == 0) {
      url = api.listUrl + "?page=" + page;
    }else{
      var box = that.data.array[that.data.index]
      url = api.listBoxUrl + "box=" + box + "&page=" + page;
    }
    console.log(url)
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
        echowall: data
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.addData();
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
    this.resetData()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   * 2018-10-09 添加上划延迟
   */
  onReachBottom: function () {
    // if (this.data.loading) return;
    // this.setData({ loading: true });
    // this.updateRefreshIcon();
    // setTimeout(() =>{ //计时器
    this.addData(); //载入新一批数据
    //   this.setData({ loading: false });
    // }, 3000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  updateRefreshIcon: function() {
    var deg = 360;
    console.log('start anima')
    var animation = wx.createAnimation({
        duration: 4000,
        timingFunction: 'ease-in-out',
      });
    var timer = setInterval(() => {
      if (!this.data.loading)
        clearInterval(timer);
      animation.rotateY(deg).step();//在Z轴旋转一个deg角度
      deg = deg + 360;
      this.setData({
        refreshAnimation: animation.export()
      })
    }, 0);
  },

  focus: function(e){
    this.setData({
      search_status: 1
    })
  },

  unfocus: function(e){
    this.setData({
      search_status: 0
    })
  },

  filterTab: function(e){
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab:data
    })
  },

  filter: function(e){
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          time_id: id,
          time_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          popular_id: id,
          popular_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          mailbox_id: id,
          mailbox_txt: txt
        });
        break;
    }
    //数据筛选
    //self.getDataList();
  }


})
