var app = getApp();
Page({
  data: {
    dataList:[],
    identity:'0'
  },
  onLoad: function (options) {
    this.setData({identity: wx.getStorageSync("identity") })
    if(wx.getStorageSync("identity") == 1){
      this.list(0)
    }else{
      this.list(1)
    }
  },
  // 进入详情页
  onClickDetails(e) {
    wx.navigateTo({
      url: '../details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // 立即开通
  onClickKaiTong(){
    wx.pageScrollTo({
      scrollTop: 300,
      duration: 300
    })
  },
  list(goodsType){
    app.func.reqget('/xcx/user/fetchTinyUser', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({ avatar: res.data.avatar, active: false })
      }
    })
    app.func.reqget('/xcx/goods/fetchGoodsList', { goodsType: goodsType, page: 1, limit:20 }, (res) => {
      this.setData({
        dataList: res.data.content
      })
    })
    app.func.reqget('/xcx/user/fetchShopKeeperCenterConfig', {}, (res) => {
      if (res.code == 'ok') {
       this.setData({configData:res.data})
      }
    })
  },
  onReachBottom: function () {

  },
  preventD(){
    return false
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
    }
    return {
      title: ops.target.dataset.data.goodsName,
      imageUrl: ops.target.dataset.data.goodsCoverImg,//图片地址
      path: '/page/details/index?id=' + ops.target.dataset.data.id,// 用户点击首先进入的当前页面
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})