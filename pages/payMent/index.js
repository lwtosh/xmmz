var app = getApp();
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
Page({
  data: {
    carts:[],
    ids:[],
    addresssInfo:{},
    status:'',
    orderNo: '',
    logisticsPrice:0,
    orderId:'',
    msgShow1:false,
    disabled: false,
    disabled1: false
  },
  onClickadd(){
    wx.navigateTo({
      url: '../addressman/index'
    })
  },
  onLoad: function (options) {
    console.log(options)
    if (options.arr){
      this.setData({status:'1', carts: this.data.carts.concat(JSON.parse(options.arr))})
    }else{
      this.setData({ carts: this.data.carts.concat(options), cartNum: options.cartNum })
    }
    if (options.orderNo){
      this.setData({ addresssInfo: options, total: options.totalPrice, orderNo: options.orderNo, orderId: options.orderId})
    }else{
      this.address()
      this.sum() 
    }
  },
  onShow(e){
    if (this.data.item){
      this.setData({ addresssInfo: JSON.parse(this.data.item) })
    }else{
      this.address()
      this.sum() 
    }
  },
  address(){
    if (Object.keys(this.data.addresssInfo).length == 0){
      app.func.reqget('/xcx/user/fetchUserDefaultAddress', {}, (res) => {
        if (res.code == 'ok' && res.data) {
          this.setData({addresssInfo:res.data})
        }
      })
    }
  },
  // 付款方式
  payMethod(){
    if (JSON.stringify(this.data.addresssInfo) == "{}"){
      Toast('请添加地址')
    }else{
      if (this.data.cartNum == '3') {
        app.func.reqpost('/xcx/goods/addGoodsSpellGroup', { goodsId: this.data.carts[0].id, skuId: this.data.carts[0].gg_ids, addressId: this.data.addresssInfo.id, cartIds: this.data.ids, num: this.data.carts[0].saleNumber }, (res) => {
          if (res.code == 'ok') {
            this.setData({
              orderNo: res.data.orderNo,
              orderId: res.data.id
            })
            if (this.data.configs !== 'BALANCE') {
              this.weixin()
            } else {
              this.setData({ msgShow1: true })
            }
          } else {
            Toast(res.message)
          }
        })
      } else if (this.data.cartNum == '4') {
        app.func.reqpost('/xcx/goods/joinSpellGroup', { spellGroupId: this.data.carts[0].spellGroupId, goodsId: this.data.carts[0].id, skuId: this.data.carts[0].gg_ids, addressId: this.data.addresssInfo.id, cartIds: this.data.ids, num: this.data.carts[0].saleNumber }, (res) => {
          if (res.code == 'ok') {
            this.setData({
              orderNo: res.data.orderNo,
              orderId: res.data.id
            })
            if (this.data.configs !== 'BALANCE') {
              this.weixin()
            } else {
              this.setData({ msgShow1: true })
            }
          } else {
            Toast(res.message)
          }
        })
      } else if (this.data.orderNo) {
        if (this.data.configs == 'BALANCE') {
          this.setData({ msgShow1: true })
        } else {
          this.weixin()
        }
      } else {
        this.createOrder()
      }
    }
    
  },
  // 余额付款
  onClickpay1() {
    this.setData({ disabled1: true, configs:'BALANCE'})
    this.payMethod()
  },
  haldMsg() { this.setData({ msgShow1: false })},
  //总价
  sum: function (e) {
    if (this.data.total){

    }else{
      var carts = this.data.carts;
      var total = 0;
      for (var i = 0; i < carts.length; i++) {
        this.setData({ ids: this.data.ids.concat(carts[i].id) })
        total += (carts[i].saleNumber ? carts[i].saleNumber : 0) * carts[i].salePrice;
      }
      app.func.reqget('/xcx/order/fetchLogisticePrice', { cartIds: this.data.ids }, (res) => {
        if (res.code == 'ok') {
          this.setData({ logisticsPrice: res.data})
        } else {
          Toast(res.message)
        }
      })
      this.setData({
        carts: carts,
        total: (total).toFixed(2),
        totals: (parseInt(total) + parseInt(this.data.logisticsPrice)).toFixed(2)
      });
    }
    
  },
  // 微信付款
  onClickpay2(){
    this.setData({ disabled: true })
    app.func.reqget('/xcx/pay/fetchPayConfigs', { payType: 'MALL_ORDER_MONEY'}, (res) => {
      if (res.code == 'ok') {
        this.setData({ configs: res.data[0].payMethod})
        this.payMethod()
      } else {
        Toast(res.message)
      }
    })
  },
  // 创建订单
  createOrder(){
    var that = this
    if (that.data.status == ''){
      app.func.reqpost('/xcx/order/createOrder', { goodsId: that.data.carts[0].id, addressId: that.data.addresssInfo.id, skuId: that.data.carts[0].gg_ids, goodsNum: that.data.carts[0].saleNumber }, (res) => {
        if (res.code == 'ok') {
          that.setData({
            orderNo: res.data.orderNo,
            orderId: res.data.id
          });
          if (that.data.configs !== 'BALANCE'){
            that.weixin()
          } else {
            that.setData({ msgShow1: true })
          }
        } else {
          Toast(res.message)
        }
      })
    }else{
      app.func.reqpost('/xcx/order/createCartOrder', { cartIds: that.data.ids, addressId: that.data.addresssInfo.id}, (res) => {
        if (res.code == 'ok') {
          that.setData({
            orderNo: res.data.orderNo,
            orderId: res.data.id
          });
          if (that.data.configs !== 'BALANCE') {
            that.weixin()
          } else {
            that.setData({ msgShow1: true })
          }
        } else {
          Toast(res.message)
        }
      })
    }
    that.setData({ disabled1: false})
  },
  weixin(){
    var cartNum = this.data.cartNum
    app.func.reqpost('/xcx/order/payOrder', { orderId: this.data.orderId, payMethod: this.data.configs, addressId: this.data.addresssInfo.id}, (res) => {
      if (res.code == 'ok') {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            wx.redirectTo({
              url: '../pay/index?cartNum=' + cartNum
            })
           },
          complete(res){},
          fail(res) { 
          }
        })
      } else {
        Toast(res.message)
      }
    })
      setTimeout(() => { this.setData({ disabled: false }) }, 3000)
  },
  //余额支付
  payment(){
    this.setData({ disabled1: true })
    this.pay('BALANCE')
  },
  pay(payMethod){
    var that = this
    app.func.reqpost('/xcx/order/payOrder', { orderId: that.data.orderId, payMethod: payMethod, addressId: that.data.addresssInfo.id}, (res) => {
      if (res.code == 'ok') {
        wx.redirectTo({
          url: '../pay/index?cartNum=' + this.data.cartNum
        })
      }
    })
  }
})