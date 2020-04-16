var app = getApp();
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    falg1:true,
    showShop: false,
    selectedAllStatus:false,
    carts: [],
    total:'￥0:00',
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled']
  },
  // 进入详情页
  onClickDetails(e) {
    wx.navigateTo({
      url: '../details/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onClose2() {
    var that = this
    wx.showTabBar
    that.setData({ showShop: false })
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
  // 修改规格
  onCLickGuige(e) {
    app.func.reqget('/xcx/goods/fetchGoodsSkuList', { goodsId: e.currentTarget.dataset.data.goodsId, page: 1, limit: 20 }, (res) => {
      if (res.code === 'ok') {
        this.setData({
          dataCart: e.currentTarget.dataset.data,
          gg_id: e.currentTarget.dataset.data.skuName,
          gg_ids: e.currentTarget.dataset.data.skuId,
          gg_txt: e.currentTarget.dataset.data.skuName,
          valueNum: e.currentTarget.dataset.data.goodsNum,
          guigeList: res.data.content,
        })
      }
    })
    this.setData({ showShop: true })
  },
  // 修改保存
  onClickQueding(){
    app.func.reqpost('/xcx/goods/updateSkuOrNum', { cartId: this.data.dataCart.id, goodsId: this.data.dataCart.goodsId, skuId: this.data.gg_ids ? this.data.gg_ids : '0', num: this.data.valueNum,}, (res) => {
      if (res.code === 'ok') {
        Toast('修改成功')
       setTimeout(()=>{
         this.list(1)
       },500)
        this.setData({ showShop: false })
      }
    })
  },
  onChange(event) {
    this.setData({ valueNum: event.detail });
  },
  onCLick1() { this.setData({ falg1: false })},
  onCLick2() { this.setData({ falg1:true})},
  // 减少数量
  bindMinus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var data = e.currentTarget.dataset.data
    var num = this.data.carts[index].goodsNum;
    if (num > 1) {
      num--
      app.func.reqpost('/xcx/goods/updateSkuOrNum', { cartId: data.id, goodsId: data.goodsId, skuId: data.skuId ? data.skuId : '0', num: num, }, (res) => {
        if (res.code === 'ok') {
        }
      })
     
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].goodsNum = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    this.sum()
  },
  // 增加数量
  bindPlus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var data = e.currentTarget.dataset.data
    var num = this.data.carts[index].goodsNum;
    // 自增
    num++
    app.func.reqpost('/xcx/goods/updateSkuOrNum', { cartId: data.id, goodsId: data.goodsId, skuId: data.skuId ? data.skuId : '0', num: num, }, (res) => {
      if (res.code === 'ok') {
      }
    })
   
    // 只有大于一件的m时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
   
    var carts = this.data.carts;
    carts[index].goodsNum = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    this.sum()
  },
  bindCheckbox: function (e) {
    //绑定点击事件，将checkbox样式改变为选中与非选中
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].goodsVo.status;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].goodsVo.status = !selected;
    // if (carts[index].goodsVo.status = false){
    //   this.setData({ selectedAllStatus:false})
    //   console.log(this.data.selectedAllStatus)
    // }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts
    });
    this.sum()
  },
  // 删除
  cartDel(){
    var ids = []
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].goodsVo.status == true) {
        ids = ids.concat(this.data.carts[i].id)
      }
    }
    if (ids == '') {
      Toast('请选择商品')
    }else{
      Dialog.confirm({
        title: '温馨提示',
        message: '确定要删除吗',
        asyncClose: true,
        confirmButtonColor: '#EF8D06'
      }).then(() => {
        app.func.reqpost('/xcx/goods/batchRemoveByUserAndIds', { cartIds: ids  }, (res) => {
          if (res.code == 'ok') {
            this.list(1)
            Dialog.close()
          } else {
            Toast(res.message)
          }
        })
      }).catch(() => {
        Dialog.close();
      });
    }
  },
  bindSelectAll: function (e) {
    // 环境中目前已选状态 
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作 
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值 
    var carts = this.data.carts;
    // 遍历 
    for (var i = 0; i < carts.length; i++) {
      carts[i].goodsVo.status = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts
    });
    this.sum()
  },
  bindCheckout: function (e) {
    // 初始化toastStr字符串
    var toastStr = 'cid:';
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].goodsVo.status) {
        toastStr += this.data.carts[i].cid;
        toastStr += ' ';
      }
    }
    //存回data
    this.setData({
      toastHidden: false,
      toastStr: toastStr
    });
  },
  bindToastChange: function (e) {
    this.setData({
      toastHidden: true
    });
  },
  //总价
  sum: function (e) {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      
      if (carts[i].goodsVo.status) {
        total += (carts[i].goodsNum ? carts[i].goodsNum : 0) * carts[i].goodsVo.salePrice;
      }
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: '￥' + (total).toFixed(2)
    });
  },
  onLoad: function (options) {
    this.list(1)
    this.setData({ identity: wx.getStorageSync("identity")})
    // 页面初始化 options为页面跳转所带来的参数
    this.sum()
  },
  onHide(){
    this.setData({
      falg1: true,
      showShop: false,
      selectedAllStatus: false,
      total: '￥0:00'})
  },
  onShow: function () {
    this.onLoad()
    pageLifetimes:{
        if (typeof this.getTabBar === 'function' &&
          this.getTabBar()) {
          this.getTabBar().setData({
            selected: 3
          })
        }
    }
  },
  // 结算
  settlement(){
    var arr = []
    if (this.data.carts.length>0){
      for (var i = 0; i < this.data.carts.length; i++) {
        if (this.data.carts[i].goodsVo.status == true) {
          this.setData({
            arr: arr.push({ goodsName: this.data.carts[i].goodsVo.goodsName, gg_txt: this.data.carts[i].skuName, gg_ids: this.data.carts[i].skuId, saleNumber: this.data.carts[i].goodsNum, salePrice: this.data.carts[i].goodsVo.salePrice, marketPrice: this.data.carts[i].goodsVo.marketPrice, goodsCoverImg: this.data.carts[i].goodsVo.goodsCoverImg, id: this.data.carts[i].id })
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '../payMent/index?arr=' + JSON.stringify(arr),
            })
          }, 500)
        }else{
          Toast('请选择商品')
        }
        
      }
    }else{
      Toast('请选择商品')
    }
    
  },
  list(page) {
    app.func.reqget('/xcx/goods/fetchCartGoodsList', { goodsType: 0, page: page, limit:20}, (res) => {
      if (res.code == 'ok') {
        for (var i = 0; i < res.data.content.length; i++){
          res.data.content[i].goodsVo.status =false
        }
        if (res.data.hasNext == true && this.data.refresh == true) {
          this.setData({
            carts: this.data.carts.concat(res.data.content),
            hasNext: true
          })
        } else if (this.data.refresh == true) {
          this.setData({ carts: this.data.carts.concat(res.data.content), hasNext: res.data.hasNext })
        } else {
          this.setData({ carts: res.data.content, hasNext: res.data.hasNext })
        }
      }else{
        Toast(res.message)
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({ refresh: false })
    wx.stopPullDownRefresh() 
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.list(1)
    this.setData({
      falg1: true,
      showShop: false,
      selectedAllStatus: false,
      total: '￥0:00'})
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
      var page = ''
      page ++
      this.list(page)
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);

  },
 
})