var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: '', //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    navData: [],
    page: '1',
    dataList: []
  },
  onClickDetails(e) {
    wx.navigateTo({
      url: '../details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.category(e.detail.current, 1)
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    this.category(e.target.dataset.current, 1)
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    var singeNavWidth = this.data.windowWidth / 3;
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    this.list()
  },
  onShow: function () {
    // this.list()
  },
  list() {
    app.func.reqget('/xcx/goods/fetchTopGoodsCategory', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({
          navData: res.data,
          currentTab: res.data[0].id
        })
        this.category(this.data.navData[0].id, 1)
      }
    })
  },
  category(categoryId, page) {
    wx.showLoading({
      title: '加载中',
    })
    app.func.reqget('/xcx/goods/fetchGoodsList', { categoryId: categoryId, goodsType: '0', page: page, limit: '20' }, (res) => {
      if(res.code == 'ok'){
        wx.hideLoading()
        if (res.data.hasNext == true || this.data.refresh == false) {
          this.setData({
            dataList: this.data.dataList.concat(res.data.content),
            hasNext: res.data.hasNext
          })
        } else if (this.data.refresh == false) {
          this.setData({ dataList: this.data.dataList.concat(res.data.content), hasNext: res.data.hasNext })
        } else {
          this.setData({ dataList: res.data.content, hasNext: res.data.hasNext })
        }
      }
      
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ refresh: true })
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.category(this.data.currentTab, 1)
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1500);
  },
  onReachBottom: function () {
    if (this.data.hasNext == true) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({ refresh: false })
      this.data.page++
      this.category(this.data.currentTab, this.data.page)
    } else {
      this.setData({ activeNo: true })
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  }
})