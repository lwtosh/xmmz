var app = getApp();
var time = require("../../utils/util.js")
Page({
  data: {
    infoList: []
  },
  onLoad: function (options) {
    this.list(1)
  },
  list(page) {
    app.func.reqget('/xcx/message/fetchUserMessages', { page: page, limit: '20' }, (res) => {
      if (res.code == 'ok') {
        for (let i = 0; i < res.data.content.length; i++) {
          res.data.content[i].sendTime = time.formatTime(res.data.content[i].sendTime)
        }
        if (res.data.hasNext == true && this.data.refresh == true) {
          this.setData({
            infoList: this.data.infoList.concat(res.data.content),
            hasNext: true
          })
        } else if (this.data.refresh == true) {
          this.setData({ infoList: this.data.infoList.concat(res.data.content), hasNext: res.data.hasNext })
        } else {
          this.setData({ infoList: res.data.content, hasNext: res.data.hasNext })
        }
      }
    })
  },
  onShow: function () {

  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ refresh: false })
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.list(1)
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1500);
  },
  onReachBottom: function () {
    this.setData({ refresh: true })
    if (this.data.hasNext == true) {
      wx.showLoading({
        title: '加载中',
      })
      this.data.page++
      this.list(this.data.page)
    } else {
      this.setData({ activeNo: true })
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
})