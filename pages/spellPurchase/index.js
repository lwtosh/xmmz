var time = require("../../utils/util.js")
var app = getApp();
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
Page({
  data: {
    statusType: [
      { name: "全部", page: '' },
      { name: "进行中", page: 1 },
      { name: "拼团成功", page: 2 },
      { name: "拼团失败", page: 3 }],
    currentType: '',
    nav:'margin:0 50rpx',
    list: [[], [], [], []],
    dataList: [],
    windowHeight: ''
  },
  onLoad(options) {
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight
    })
    this.list('', 1)
  },
  onShow(){
    
  },
  // 点击tab切换 
  swichNav: function (res) {
    if (this.data.currentType == res.detail.currentNum) return;
    this.setData({
      currentType: res.detail.currentNum
    })
    if (res.detail.currentNum == 0) {
      this.list('', 1)
    } else {
      this.list(this.data.currentType, 1)
    }
  },
  bindChange: function (e) {
    this.setData({
      currentType: e.detail.current
    })
    if (e.detail.current == 0) {
      this.list('', 1)
    }else{
      this.list(e.detail.current, 1)
    }
    
  },
  list(status, page) {
    wx.showLoading({
      title: '加载中',
    })
    app.func.reqget('/xcx/goods/fetchUserSpellList', { status: status, page: page, limit: '20' }, (res) => {
      if (res.code == 'ok') {
        wx.hideLoading();
        for (let i = 0; i < res.data.content.length; i++) {
          res.data.content[i].updateTime = time.formatTime(res.data.content[i].updateTime)
        }
        if (res.data.hasNext == true && this.data.refresh == false) {
          this.setData({
            dataList: this.data.dataList.concat(res.data.content),
            hasNext: res.data.hasNext
          })
        } else if (this.data.refresh == false) {
          this.setData({
            dataList: this.data.dataList.concat(res.data.content),
            hasNext: res.data.hasNext
          })
        } else {
          this.setData({
            dataList: res.data.content,
            hasNext: res.data.hasNext
          })
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ refresh: true })
    wx.stopPullDownRefresh()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.list(this.data.currentType, 1)
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1500);
  },
  scrolltolower() {
    this.setData({ refresh: false })
    if (this.data.hasNext == true) {
      wx.showLoading({
        title: '加载中',
      })
      var page = '1'
      page++
      if (res.detail.currentNum == 0) {
        this.list('', 1)
      }else{
        this.list(this.data.currentType, page)
      }
    } else {
      this.setData({ active: true })
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
    }
    return {
      title: ops.target.dataset.name,
      imageUrl: ops.target.dataset.goodsCoverImg,//图片地址
      path: '/pages/details/index?id=' + ops.target.dataset.id,// 用户点击首先进入的当前页面
      success: function (res) {
      },
      fail: function (res) {
      }
    }

  }
})