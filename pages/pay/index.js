Page({
  data: {
    cartNum:''
  },
  onLoad: function (options) {
    console.log(options)
    if (options.cartNum){
      this.setData({ cartNum: options.cartNum})
    }
  },
  back(){
    wx.switchTab({
      url: '../home/index'
    })
  },
  order() {
    if (this.data.cartNum == 3 || this.data.cartNum == 4){
      wx.redirectTo({
        url: '../spellPurchase/index'
      })
    }else{
      wx.redirectTo({
        url: '../order/index?status=1'
      })
    }
  }
})