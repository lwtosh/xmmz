var app = getApp();
Page({
  data: {
    swiperCurrent: 0,
    imgUrl: [{'picUrl':'../../assets/pro1.png'}],
    dataList1: [],
    dataList2:[],
    userActive: true
    
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 进入详情页
  onClickDetails(e){
    wx.navigateTo({
      url: '../details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 进入详情页
  onClickSearch(e) {
    wx.navigateTo({
      url: '../search/index'
    })
  },
  bindscroll: function (e) {
    let width = e.detail.scrollWidth
    let left = e.detail.scrollLeft
    let scrollLeft = this.data.scrollLeft
    scrollLeft = (left + wx.getSystemInfoSync().windowWidth) / width
    // console.log(wx.getSystemInfoSync().windowWidth)
    scrollLeft = scrollLeft / 100
    this.setData({
      scrollLeft: scrollLeft
    })
  },
  onLoad: function (options) {
  this.list()
    console.log(options)
    // if (options.inviteCode) {
      // let scene = decodeURIComponent(options.scene);
      // let userId = scene.split("&")[0];
      wx.setStorageSync('inviteCode', options.inviteCode)
    // }
  },
  // 获取数据
  list(){
    app.func.reqget('/xcx/auction/fetchBanners', { type: 'INDEX', }, (res) => {
      if(res.code== 'ok' && res.data.length !== 0){
        this.setData({
          imgUrl: res.data
        })
      }
    })
    app.func.reqget('/xcx/goods/fetchRecommendList', { type: 'NEWEST', }, (res) => {
      this.setData({
        dataList1: res.data.content
      })
    })
    app.func.reqget('/xcx/goods/fetchRecommendList', { type: 'COMB', }, (res) => {
     
      this.setData({
        dataList2: res.data.content
      })
    })
  },
  onShow(){
    pageLifetimes: {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.list()
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1000);
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})