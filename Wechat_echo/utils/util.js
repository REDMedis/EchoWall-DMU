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
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        resolve(res.data);
        console.log(res.data);
      },
      fail: function (res) {
        console.log(res.data);
      },
      complete: function (res) {
        console.log(res.data);
      },
    })
  });
}

function fuck(){
  console.log("fuck");
}

module.exports = {
  formatTime: formatTime,
  request,
}
