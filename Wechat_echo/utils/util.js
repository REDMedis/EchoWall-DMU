var api = require('../config/api.js');
var app = getApp();


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function request(url, data = {}, method = "GET"){
  return new Promise(function (resolve, reject){
    wx.request({
      url: url,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token'),
      },
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // 直接上报数据
        resolve(res);
        console.log(res);
      },
      fail: function (res) {
        reject(res.status)
        console.log(res);
      },
      complete: function (res) {
      },
    })
  });
}


module.exports = {
  formatTime: formatTime,
  request,
}
