var rootDocment = 'https://mz-api-test.luba168.cn';
function req1(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
      'uid': wx.getStorageSync('uid'),
      'token': wx.getStorageSync('token'),
      'loginChannel': 'WXXCX'
    },
    success: function (res) {
      if (getCurrentPages().length !== 0) {
        var pages = getCurrentPages()
        var url = pages[pages.length - 1].route
      }
      if (res.data.code == 'B19' && (url.indexOf('home') == -1 && url.indexOf('shopkeeperCenter') == -1 && url.indexOf('shop') == -1) && (url.indexOf('my') == -1 && url.indexOf('cart') == -1) && wx.getStorageSync('isLogin')) {
        wx.removeStorageSync('token')
        wx.removeStorageSync('uid')
        wx.removeStorageSync('wxLoginId')
          wx.navigateTo({
            url: '../login/index'
          })
      } else if (res.code =='B23'){
        wx.showToast({
          title: res.message,
          duration: 2000
        })
      }
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
function req2(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    header: {
      'content-type': 'application/json', // 默认值
      'uid': wx.getStorageSync('uid'),
      'token': wx.getStorageSync('token'),
      'loginChannel': 'WXXCX'
    },
    success: function (res) {
      var pages = getCurrentPages()
      if (pages.length !== 0){
        var url = pages[pages.length - 1].route
      }
      if (res.data.code == 'B19' && (url.indexOf('home') == -1 && url.indexOf('shopkeeperCenter') == -1 && url.indexOf('shop') == -1) && (url.indexOf('my') == -1 && url.indexOf('cart') == -1) && wx.getStorageSync('isLogin')) {
        wx.removeStorageSync('token')
        wx.removeStorageSync('uid')
        wx.removeStorageSync('wxLoginId')
          wx.navigateTo({
            url: '../login/index'
          })
      } else if (res.code == 'B23') {
        wx.showToast({
          title: res.message,
          duration: 2000
        })
      }
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
module.exports = {
  req1: req1,
  req2: req2,
}