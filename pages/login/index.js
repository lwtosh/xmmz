//获取应用实例
const app = getApp()
var obj = wx.getLaunchOptionsSync()
var inviteCode = obj.query.inviteCode

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true,
    loading: false,
    isBindMobile: '',
    fll:'0'
  },
  onLoad: function(options) {
    var obj = wx.getLaunchOptionsSync()
    var inviteCode = obj.query.inviteCode
    wx.setStorage({
      key: 'inviteCode',
      data: inviteCode
    })
    wx.setStorageSync('isLogin', false)
    wx.login({
      success: function(res) {
        wx.setStorageSync('code', res.code)
      }
    })
  },

  bindGetUserInfo: function(e) {
    this.setData({
      loading: true,
      fll:'1'
    })
    var that = this;
    if (e.detail.userInfo) {
      app.func.reqpost('/xcx/login/doLoginByCode', {
        authCode: wx.getStorageSync('code'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }, (res) => {
        if (res.code == 'ok') {
          var pages = getCurrentPages()
          var path = `${pages[pages.length - 2].route}` 
          wx.setStorage({ key: 'wxLoginId',data: res.data.wxLoginId})
          if (res.data.isBindMobile === true) {
            wx.setStorage({ key: 'uid',data: res.data.userId})
            wx.setStorage({ key: 'token',data: res.data.token})
            if (path == 'pages/home/index' || path == undefined) {
              wx.switchTab({
                url: '../home/index'
              })
            } else if (path == 'pages/my/index') {
              wx.switchTab({
                url: '../my/index'
              })
            } else if (path == 'pages/cart/index') {
              wx.switchTab({
                url: '../cart/index'
              })
            } else if (path == 'pages/shop/index') {
              wx.switchTab({
                url: '../shop/index'
              })
            } else if (path == 'pages/shopkeeperCenter/index') {
              wx.switchTab({
                url: '../shopkeeperCenter/index'
              })
            }else {
              wx.redirectTo({
                url: '../../' + path,
              })
            }
            wx.setStorageSync('isLogin', true)
          } else {
            that.setData({
              loading: false,
              flag: false
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            duration: 2000
          })
          that.Login()
          that.setData({
            loading: false,
            flag: false
          })
        }
      })
    } else {
      wx.switchTab({
        url: '../home/index'
      })
    }
  },
  handleGetPhoneNumber(e) {
    this.setData({
      loading: true
    })
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.func.reqpost('/xcx/login/doLoginAndBindMobile', {
        wxLoginId: wx.getStorageSync('wxLoginId'),
        encryptedData: e.detail.encryptedData,
        inviteCode: wx.getStorageSync('inviteCode') ? wx.getStorageSync('inviteCode') : 'system',
        iv: e.detail.iv
      }, (res) => {
        if (res.code == 'ok') {
          var pages = getCurrentPages()
          var path = `/${pages[pages.length - 2].route}` 
          wx.setStorage({ key: 'wxLoginId',data: res.data.wxLoginId})
          if (res.data.isBindMobile === true) {
            wx.setStorage({key: 'uid',data: res.data.userId})
            wx.setStorage({key: 'token',data: res.data.token})
            if (path == 'pages/home/index' || path == undefined) {
              wx.switchTab({
                url: '../home/index'
              })
            } else if (path == 'pages/my/index') {
              wx.switchTab({
                url: '../my/index'
              })
            } else if (path == 'pages/cart/index') {
              wx.switchTab({
                url: '../cart/index'
              })
            } else if (path == 'pages/shop/index') {
              wx.switchTab({
                url: '../shop/index'
              })
            } else if (path == 'pages/shopkeeperCenter/index') {
              wx.switchTab({
                url: '../shopkeeperCenter/index'
              })
            } else {
              wx.redirectTo({
                url: '../../' + path,
              })
            }
            wx.setStorageSync('isLogin', true)
          }
        } else {
          wx.showModal({
            content: res.message,
            showCancel: false,
            success: res => {
              if (res.confirm) { // 用户确认后
                that.setData({
                  flag: true
                });
              }
            }
          })
        }
      })
    }
  },
  bindGetUserInfo1() {
    var pages = getCurrentPages()
    var path = `${pages[pages.length - 2].route}` 
    if (path == 'pages/home/index' || path == undefined) {
      wx.switchTab({
        url: '../home/index'
      })
    } else if (path == 'pages/my/index') {
      wx.switchTab({
        url: '../my/index'
      })
    } else if (path == 'pages/cart/index') {
      wx.switchTab({
        url: '../cart/index'
      })
    } else if (path == 'pages/shop/index') {
      wx.switchTab({
        url: '../shop/index'
      })
    } else if (path == 'pages/shopkeeperCenter/index') {
      wx.switchTab({
        url: '../shopkeeperCenter/index'
      })
    } else {
      wx.redirectTo({
        url: '../../' + path,
      })
    }
  },
  onHide(){
    if (this.data.fll== '1'){
      wx.setStorageSync('isLogin', true)
    }
  },
  Login() {
    wx.login({
      success: function(res) {
        wx.setStorageSync('code', res.code)
      }
    })
  }

})