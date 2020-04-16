var app = getApp()
Page({
  data: {
    page:'1',
    dataList:[]
  },
  // 进入详情页
  onClickDetails(e) {
    wx.navigateTo({
      url: '../details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onLoad: function (options) {
    this.list(options.text,'1')
    this.setData({ text: options.text})
  },
  list(text, page){
    app.func.reqget('/xcx/goods/fetchGoodsList', { searchWord: text, goodsType: '0', page: page, limit: '20' }, (res) => {
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
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ refresh: false })
    wx.stopPullDownRefresh()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.list(this.data.text, '1')
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1000);
  },
  onReachBottom: function () {
    this.setData({ refresh: true })
    if (this.data.hasNext == true) {
      wx.showLoading({
        title: '加载中',
      })
      var page = ''
      page++
      this.list(this.data.text,page)
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);

  },
  onShareAppMessage: function () {

  }
})