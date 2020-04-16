var app = getApp();
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
Page({
  data: {
    dataList:[]
  },
  // 添加银行卡
  onClickBid(){
    wx.navigateTo({
      url: '../addBank/index'
    })
  },
  onLoad: function (options) {
   this.list()
  },
  list() {
    app.func.reqget('/xcx/account/fetchUserBanks', {}, (res) => {
      if (res.code == 'ok') {
        for (var i = 0; i < res.data.length; i++) {
          var reg = /^(\d{4})\d+(\d{4})$/
          res.data[i].bankNo = res.data[i].bankNo.replace(reg, '**** **** **** $2')
        }
        this.setData({ dataList: res.data })
      }
    })
  },
  // 解绑
  onClickDel(e){
    Dialog.confirm({
      title: '温馨提示',
      message: '确认解绑该银行卡吗？',
      asyncClose: true,
      confirmButtonColor: '#EF8D06'
    }).then(() => {
      app.func.reqpost('/xcx/account/delUserBank', { id: e.currentTarget.dataset.id }, (res) => {
        if (res.code == 'ok') {
          this.list()
          setTimeout(() => {
            Dialog.close();
          }, 1000);
        } else {
          Toast(res.message)
        }
      })
    }).catch(() => {
    });
  },
  onClickBank(e) {
    wx.navigateTo({
      url: '../withdrawalsApply/index/userBankId=' + e.currentTarget.dataset.item.id + '&bankName=' + e.currentTarget.dataset.item.bankName,
    })
  },
  onClickBid() {
    if (this.data.dataList.length >= 3) {
      Toast('最多绑定3张银行卡哦！')
    } else {
      this.show = true
    }
  },
  onShow: function () {

  },
})