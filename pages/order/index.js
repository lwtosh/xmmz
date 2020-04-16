var wxpay = require('../../utils/pay.js')
var time = require("../../utils/util.js")
var app = getApp();
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
Page({
  data: {
    statusType: [
      { name: "待付款", page: 0 },
      { name: "待发货", page: 1 },
      { name: "待收货", page: 2 },
      { name: "已完成", page: 3 }],
    currentType: 0,
    list: [0,1,2,3],
    dataList: [],
    datainfo2:[],
    msgShow:false,
    loading:false,
    hasNext:false,
    active:false,
    windowHeight: ''
  },
  onLoad(options) {
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType: options.status ? options.status : 0
    })
    if (options.status){
      this.list(options.status, 1)
    }else{
      this.list(0,1)
    }
  },
  onShow: function () {
    // if (this.data.currentType){
    //   this.list(this.data.currentType, 1)
    // }
  },
  // 取消订单
  onClick1(e) {
    Dialog.confirm({
      title: '温馨提示',
      message: '确定要取消订单吗',
      asyncClose: true,
      confirmButtonColor:'#EF8D06'
    }).then(() => {
      app.func.reqpost('/xcx/order/cancelOrder', { orderId: e.currentTarget.dataset.id }, (res) => {
        if (res.code == 'ok') {
          this.list(this.data.currentType, 1)
            Dialog.close()
        } else {
          Toast(res.message)
        }
      })
    }).catch(() => {
      Dialog.close()
    })
  },
  // 删除订单
  onClick2(){},
  // 确认收货
  onClick5(e){
    Dialog.confirm({
      title: '温馨提示',
      message: '确认收货吗',
      asyncClose: true,
      confirmButtonColor: '#EF8D06'
    }).then(() => {
      app.func.reqpost('/xcx/order/completeOrder', { orderId: e.currentTarget.dataset.id }, (res) => {
        if (res.code == 'ok') {
          this.list(this.data.currentType, 1)
            Dialog.close()
        } else {
          Toast(res.message)
        }
      })
    }).catch(() => {
      Dialog.close()
    })
  },
  // 查看物流
  onClick3(e){
    var that = this
    app.func.reqget('/xcx/order/fetchOrderLogisticsDetails?orderId=' + e.currentTarget.dataset.item.id + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].occurTime = time.formatTime(res.data[i].occurTime).split(" ")
      }
      that.setData({
        msgShow: true,
        dataInfos: res.data,
        datainfo2: e.currentTarget.dataset.item
      })
      that.setData({
        dataInfos2: res.data.slice(1, - 1),
      })
    })
  },
  haldMsg() {
    var that = this
    that.setData({
      msgShow: false
    })
  },
  list(status,page){
    app.func.reqget('/xcx/order/fetchUserOrders', { status: status, page: page, limit: '20' }, (res) => {
      if(res.code == 'ok'){
        for (let i = 0; i < res.data.content.length; i++) {
          res.data.content[i].confirmTime = time.formatTime(res.data.content[i].confirmTime)
          res.data.content[i].payTime = time.formatTime(res.data.content[i].payTime)
          res.data.content[i].dispatchTime = time.formatTime(res.data.content[i].dispatchTime)
          res.data.content[i].cancelTime = time.formatTime(res.data.content[i].cancelTime)
        }
        if (res.data.hasNext == true && this.data.refresh == false){
          this.setData({
            dataList: this.data.dataList.concat(res.data.content),
            hasNext: res.data.hasNext
          })
        } else if (this.data.refresh == false){
          this.setData({
            dataList: this.data.dataList.concat(res.data.content),
            hasNext: res.data.hasNext
          })
        }else{
          this.setData({
            dataList: res.data.content,
            hasNext: res.data.hasNext
          })
        }
      }
    })
  },
  // 付款
  onClickPay(e){
    var item = (e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../payMent/index?id=' + item.id + '&arr=' + JSON.stringify(item.orderGoodsList) + ' &orderNo=' + item.orderNo + ' &phone=' + item.addressPhone + '&totalPrice=' + item.totalPrice + '&consignee=' + item.addressContact + '&orderId=' + item.id + ' &address=' + item.address + ' &id=' + item.addressId + '&logisticsPrice=' + item.logisticsPrice
    })
  },
  // 点击tab切换 
  swichNav: function (e) {
    if (this.data.currentType == e.detail.currentNum) return;
    this.setData({
      currentType: e.detail.currentNum
    })
    this.list(this.data.currentType, 1)
  },
  bindChange: function (e) {
    this.setData({
      currentType: e.detail.current
    })
    this.list(this.data.currentType, 1)
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({refresh:true})
    wx.stopPullDownRefresh()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.list(this.data.currentType, 1)
    setTimeout(()=> {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1500);
  },
  scrolltolower() {
    this.setData({ refresh: false })
    if (this.data.hasNext == true){
      wx.showLoading({
        title: '加载中',
      })
      var page = '1'
      page++
      if (this.data.currentType == 0) {
        this.list('', 1)
      } else {
        this.list(this.data.currentType, page)
      }
    }else{
      this.setData({ active: true })
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },

})