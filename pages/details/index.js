var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    imgUrl1: ['../../assets/pro3.png'],
    imgUrl2: ['../../assets/pro3.png'],
    show: false,
    showTrem: false,
    showShop: false,
    groupData:[],
    valueNum:'1',
    dataList:{},
    cartNum :'',
    gg_ids:0,
    gg_id: 0,//规格ID
    gg_txt: '',//规格文本
    gg_price: 0,//规格价格
    mon:'',
    guigeList: [],
    userGoods:[]
  },
  onCart(){
    wx.switchTab({
      url: '../cart/index'
    })
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
  onClickshou1() {
    app.func.reqpost('/xcx/goods/enshrineGoods?id=' + this.data.dataList.id, {}, (res) => {
      if(res.code == 'ok'){
        Toast('收藏成功')
        this.list(this.data.dataList.id)
      }
    })
  },
  onClickshou2() {
    app.func.reqpost('/xcx/goods/cancelEnshrine', { ids: this.data.dataList.id }, (res) => {
      if (res.code == 'ok') {
        Toast('您已取消收藏')
        this.list(this.data.dataList.id)
      }
    })
  },
  // 查看更多拼团列表
  more(){
    var that = this
    app.func.reqget('/xcx/goods/fetchSpellGroupList', { goodsId: this.data.id, page: 1, limit: '10' }, (res) => {
      if (res.code === 'ok') {
        this.setData({
          userGoodsMore: res.data.content
        })
      }
    })
    that.setData({ show:true})
  },
  onClose() {
    var that = this
    that.setData({ show: false })
  },
  onClose1() {
    var that = this
    that.setData({ showTrem: false })
  },
  onClose2() {
    var that = this
    that.setData({ showShop: false})
  },
  // 参团
  onGoTrem(e){
    var that = this
    var item = e.currentTarget.dataset.text
    app.func.reqget('/xcx/goods/fetchSpellGroupMembers', { spellGroupId: item.id}, (res) => {
      if (res.code === 'ok') {
        if (item.needJoinNum - item.joinNum >= 1){
          res.data.content.push({ tinyUserInfo: { avatar:'../../assets/user3.png'}})
        }
        this.setData({
          groupData: res.data.content,
          needJoinNum: item.needJoinNum - item.joinNum,
          spellGroupId:item.id,
          countdown: item.countdown,
          nickName: item.tinyUserInfo.nickName,
        })
      }
    })
    that.setData({ showTrem: true})
  },
  onChange(event) {
    this.setData({ valueNum: event.detail });
  },
  // 加入到购物车
  onClickPay1(e){
    this.setData({ cartNum: '1'})
    this.skuList()
    this.setData({  showShop: true})
  },
  // 单独购买
  onClickPay2(e) {
    this.setData({ cartNum: '2' })
    this.skuList()
    this.setData({ showShop: true })
  },
  // 我要开团
  onClickPay3(e) {
    this.setData({ cartNum: '3' })
    this.skuList()
    this.setData({ showShop: true })
  },
  // 我要参团
  onClickPay(e) {
    this.setData({ cartNum: '4' })
    this.skuList()
    this.setData({ showTrem: false, show:false,showShop: true })
  },
  onClickVip(){
    wx.switchTab({
      url: '../shopkeeperCenter/index'
    })
  },
  // 产品规格
  skuList(){
    app.func.reqget('/xcx/goods/fetchGoodsSkuList', { goodsId: this.data.dataList.id, page: 1, limit: 20 }, (res) => {
      if (res.code === 'ok') {
        this.setData({
          guigeList: res.data.content,
        })
      }
    })
  },
  // 确定加入到购物车
  onClickQueding(){
    if (this.data.gg_ids == 0 && this.data.guigeList.length > 0) {
      Toast('请选择规格')
    } else {
    if (this.data.cartNum== '1'){
      app.func.reqpost('/xcx/goods/addShoppingCart', { goodsId: this.data.dataList.id, skuId: this.data.gg_ids, goodsNum: this.data.valueNum }, (res) => {
        if (res.code === 'ok') {
          Toast('已成功加入到购物车')
          this.setData({ showShop: false, info: parseInt(this.data.info) + parseInt(this.data.valueNum)})
          wx.setStorageSync('info', this.data.info)
        }
      })
    } else if (this.data.cartNum == '2' && this.data.identity == 1){
      this.setData({ showShop: false})
      if (this.data.dataList.shopFlag == 0){
        var salePrice = (this.data.dataList.salePrice == null ? 0 : this.data.dataList.salePrice)
        this.onLink(salePrice)
      }else{
      var salePrice = (this.data.dataList.shopPrice == null ? 0 : this.data.dataList.shopPrice)
      this.onLink(salePrice)
      }
      
    } else if (this.data.cartNum == '3' || this.data.cartNum == '4') {
      this.setData({ showShop: false })
      var salePrice = (this.data.dataList.groupPrice == null ? 0 : this.data.dataList.groupPrice)
      this.onLink(salePrice)
    }else{
      this.setData({ showShop: false })
      // if (this.data.dataList.shopFlag == 0){
      //   var salePrice = (this.data.dataList.salePrice == null ? 0 : this.data.dataList.salePrice)
      //   this.onLink(salePrice)
      // }else{
        var salePrice = (this.data.dataList.salePrice == null ? 0 : this.data.dataList.salePrice)
        this.onLink(salePrice)
      // }
    }
    }
  },
  // 跳转到订单
  onLink(salePrice){
    wx.navigateTo({
      url: '../payMent/index?goodsCoverImg=' + this.data.dataList.goodsCoverImg + '&goodsName=' + this.data.dataList.goodsName + '&salePrice=' + salePrice + '&marketPrice=' + this.data.dataList.marketPrice + '&saleNumber=' + this.data.valueNum + '&id=' + this.data.dataList.id + '&gg_txt=' + this.data.gg_txt + '&gg_ids=' + this.data.gg_ids + '&cartNum=' + this.data.cartNum + '&spellGroupId='+ this.data.spellGroupId
    })
  },
  onLoad: function (options) {
    this.list(options.id)
    this.setData({id: options.id, identity: wx.getStorageSync("identity")})
  },
  list(id){
    app.func.reqget('/xcx/goods/fetchDetail', { id: id,}, (res) => {
      if (res.code === 'ok') {
        for (var i = 0; i < res.data.length; i++){
          // res.data[i].mon = Math.floor(res.data[i].mon * 100) / 100
          // res.data[i].salePrice = Math.floor(res.data[i].salePrice * 100) / 100
          // res.data[i].marketPrice = Math.floor(res.data[i].marketPrice * 100) / 100
          // res.data[i].mon = res.data[i].mon.toFixed(2)
          res.data[i].salePrice = res.data[i].salePrice.toFixed(2)
          res.data[i].marketPrice = res.data[i].marketPrice.toFixed(2)
        }
        console.log(res.data)
        this.setData({
          dataList: res.data,
          info: this.data.info,
          mon: (res.data.salePrice - res.data.shopPrice).toFixed(2),
          imgUrl1: res.data.goodsImgs.split(','),
          imgUrl2: res.data.goodsDetailImgs.split(',')
        })
        wx.setNavigationBarTitle({
          title: res.data.goodsName
        })
      }else{
        Toast(res.message)
      }
    })
    app.func.reqget('/xcx/goods/countCartByUser', {}, (res) => {
      if (res.code === 'ok') {
        this.setData({
          info: res.data
        })
      }
    })
    app.func.reqget('/xcx/goods/fetchSpellGroupList', { goodsId: id}, (res) => {
      if (res.code === 'ok') {
        this.setData({
          userGoods: res.data.content
        })
      }
    })
  },
  onShow(){
    if (this.data.id){
      this.list(this.data.id)
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.list(this.data.id)
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
    }, 1000);
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
    }
    return {
      title: this.data.dataList.goodsName,
      imageUrl: this.data.dataList.goodsCoverImg,//图片地址
      path: '/pages/details/index?id='+this.data.dataList.id,// 用户点击首先进入的当前页面
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})