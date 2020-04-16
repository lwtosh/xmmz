var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    mon:52454,
    base1:0,
    realMon:0,
    rate:0.008,
    base:2,
    bankName:'',
    money:''
  },
  onLoad: function (options) {
    this.list()
  },
  // 金额计算
  onChange(e){
    if (e.detail>2){
      this.setData({ base1: (e.detail * this.data.rate + this.data.base).toFixed(2), realMon: (e.detail - (e.detail * this.data.rate + this.data.base)).toFixed(2), money: e.detail })
    }else{
      this.setData({ base1: 0, realMon: 0 })
    }
    
  },
  // 全部提现
  onClickApply() { this.setData({ money: this.data.mon})},
  // 提现
  onClick(){
    // if (this.data.bankName == "") {
    //   Toast( '请添加银行卡');
    // } else 
    if (this.data.money == "") {
      Toast('请输入您的提现金额');
    } else if (this.data.money > this.data.bankWithdrawMaxMoney) {
      Toast('不能大于最高提现金额');
    } else if (this.data.money < this.data.bankWithdrawMinMoney) {
      Toast('不能小于最底提现金额');
    }else{
      app.func.reqpost('/xcx/account/withdraw', { withdrawType: 'WEIXIN', money: this.data.money}, (res) => {
        if (res.code === 'ok') {
          Toast('提现成功')
          wx.navigateBack({
            data:1
          })
        } else {
          Toast(res.message)
        }
      })
    }
  },
  list(){
    app.func.reqget('/xcx/account/fetchLastBankInfo', { withdrawType: 'BANK'}, (res) => {
      if (res.code == 'ok' && res.data){
        that.setData({ bankName: res.data.bankName, bankId: res.data.bankId });
      }
    })
  },
  onShow: function () {

  },
})