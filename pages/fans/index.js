var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    dataList: [],
  },
  onLoad: function (options) {
    this.list(1)
  },
  list(page){
    app.func.reqget('/xcx/user/fetchMyTeamUsers', { page: page, size: '20' }, (res) => {
      if (res.code == 'ok') {
        if (res.data.hasNext == true && this.data.refresh == true) {
          this.setData({
            dataList: this.data.dataList.concat(res.data.content),
            hasNext: true
          })
        } else if (this.data.refresh == true) {
          this.setData({ dataList: this.data.dataList.concat(res.data.content), hasNext: res.data.hasNext })
        } else {
          this.setData({ dataList: res.data.content, hasNext: res.data.hasNext })
        }
      } else {
        Toast(res.message)
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
  onShareAppMessage: function () {

  }
})