var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    dataList:[],
    shopData:{},
    guigeList:[],
    gg_txt:'',
    valueNum:'1',
    gg_ids:'0',
    falg1:true,
    showShop:false
  },
  onCLick1() { this.setData({ falg1: false }) },
  onCLick2() { this.setData({ falg1: true})},
  onLoad: function (options) {
    this.list(1)
  },
  // 进入详情页
  onClickDetails(e) {
    wx.navigateTo({
      url: '../details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  list(page) {
    app.func.reqget('/xcx/goods/enshrineList', { page: page, size: '20' }, (res) => {
      if (res.code == 'ok') {
        for (var i = 0; i < res.data.content.length; i++){
          res.data.content[i].status = false
        }
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
  onClose2() {
    var that = this
    that.setData({ showShop: false })
  },
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.dataList[index].status;
    var dataList = this.data.dataList;
    // 对勾选状态取反
    dataList[index].status = !selected;
    // 写回经点击修改后的数组
    this.setData({
      dataList: dataList
    });
  },
  bindSelectAll: function (e) {
    // 环境中目前已选状态 
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作 
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值 
    var dataList = this.data.dataList;
    // 遍历 
    for (var i = 0; i < dataList.length; i++) {
      dataList[i].status = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      dataList: dataList
    });
  },
  // 取消收藏
  onclickCance(){
    var ids = []
    for (var i = 0; i < this.data.dataList.length; i++) {
      if (this.data.dataList[i].status == true){
          ids=ids.concat(this.data.dataList[i].id)
      }
    }
    if (ids==''){
      Toast('请选择商品')
    }else{
      app.func.reqpost('/xcx/goods/cancelEnshrine', { ids: ids }, (res) => {
        if (res.code == 'ok') {
          Toast('取消成功')
            this.list(1)
        } else {
          Toast(res.message)
        }
      })
    }
    
  },
  // 加入购物车
  onClickcart(e){
    this.setData({ showShop: true, shopData:e.currentTarget.dataset.txt})
    this.skuList()
  },
  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, price = e.currentTarget.dataset.price
    self.setData({
      gg_id: id,
      gg_ids: e.currentTarget.dataset.ids,
      gg_txt: txt,
      gg_price: price
    });
  },
  // 产品规格
  skuList() {
    app.func.reqget('/xcx/goods/fetchGoodsSkuList', { goodsId: this.data.shopData.id, page: 1, limit: 20 }, (res) => {
      if (res.code === 'ok') {
        this.setData({
          guigeList: res.data.content,
        })
      }
    })
  },
  onChange(event) {
    this.setData({ valueNum: event.detail });
  },
  // 确定加入到购物车
  onClickQueding() {
    app.func.reqpost('/xcx/goods/addShoppingCart', { goodsId: this.data.shopData.id, skuId: this.data.gg_ids, goodsNum: this.data.valueNum }, (res) => {
        if (res.code === 'ok') {
          Toast('已加入到购物车')
          this.setData({ showShop: false })
        }
      })
  },
  onShow: function () {
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ refresh: false, falg1:true})
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