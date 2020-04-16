var http = require('utils/httpres.js') 

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    wx.setStorageSync('isLogin', true)
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.getSystemInfo({ // 获取设备信息
      success: (res) => {
        this.globalData.systeminfo = res
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.navH = res.statusBarHeight;
        this.platform = res.platform;
      },
    })
    // 获得胶囊按钮位置信息
    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect()
    http.req2('/xcx/user/fetchMyIdentity', {}, (res) => {
      if (res.code === 'ok') {
        wx.setStorageSync('identity', res.data.identity)
      }
    })
    // var info = setInterval(()=>{
    //   http.req2('/xcx/message/fetchUnReadNum', {}, (res) => {
    //     if (res.code === 'ok') {
    //       wx.setStorageSync('infoNum', res.data)
    //     }
    //   })
    // },10000)
   
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onHide(){},
  globalData: {
    userInfo: null,
    headerBtnPosi:{},
    systeminfo:{},
    navHeight:0
  },
   func: {
    reqget: http.req2, //这里配置我们需要的方法
    reqpost: http.req1,  //这里配置我们需要的方法
  }
})