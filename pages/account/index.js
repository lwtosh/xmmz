var app = getApp();
var time = require("../../utils/util.js")
Page({
  data: {
    dataInfo: [],
    page:'1',
    money:'',
    refresh:false
  },
  onLoad: function (options) {
    this.setData({ money: options.money})
  },
  list(page){
    app.func.reqget('/xcx/account/fetchMoneyLogs', { page: page, limit:'20'}, (res) => {
      if (res.code == 'ok') {
        for (let i = 0; i < res.data.content.length; i++) {
          res.data.content[i].occurTime = time.formatTime(res.data.content[i].occurTime)
        }
        if (res.data.hasNext == true && this.data.refresh == true) {
          this.setData({
            dataInfo: this.data.dataInfo.concat(res.data.content),
            hasNext: true
          })
        } else if (this.data.refresh == true) {
          this.setData({ dataInfo: this.data.dataInfo.concat(res.data.content), hasNext: res.data.hasNext })
        }else{
          this.setData({ dataInfo: res.data.content, hasNext: res.data.hasNext})
        }
      }
    })
  },
  onShow: function () {
    this.list(1)
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
      this.data.page ++
      this.list(this.data.page)
    }else{
      this.setData({ activeNo: true})
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
})