var app = getApp();
Page({
  data: {
    active:true,
    userInfo:{},
    avatar:['../../assets/user-1.png'],
    dataList:{}
  },
  // onLoad: function (options) {
  //   this.list()
  // },
  onShow: function () {
    this.list()
    this.setData({ infoNum: wx.getStorageSync('infoNum')})
    pageLifetimes: {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 5
        })
      }
    }
  },
  list(){
    app.func.reqget('/xcx/user/fetchTinyUser', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({ userInfo: res.data, active:false})
      }
    })
    app.func.reqget('/xcx/order/fetchOrderCount', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({ orderData: res.data})
      }
    })
    app.func.reqget('/xcx/user/fetchUserInfoCount', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({ accoutData: res.data})
      }
    })
    app.func.reqget('/xcx/user/fetchMyIdentity', {}, (res) => {
      if (res.code === 'ok') {
        this.setData({ identity: res.data.identity })
        wx.setStorageSync('identity', res.data.identity)
      }
    })
    app.func.reqget('/xcx/message/fetchUnReadNum', {}, (res) => {
      if (res.code === 'ok') {
        wx.setStorageSync('infoNum', res.data)
      }
    })
  },
  // 登录
  handleLogin(){
    wx.navigateTo({
      url: '../login/index'
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.list()
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1000);
  },
  onShareAppMessage: function () {

  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 5
        })
      }
    }
  }
})