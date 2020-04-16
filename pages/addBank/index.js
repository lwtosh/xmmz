var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    region: ['请选择省市区'],
    columns:[],
    phone:"",
    bankNo:''
  },
  onLoad: function (options) {
    this.addBank()
  },
  onConfirm1(e){
    this.setData({ bankNo: e.detail})
  },
  onConfirm2(e) {
    this.setData({ phone: e.detail })
  },
  addBank() {
    var that = this
    app.func.reqget('/xcx/account/fetchBankConfigs', {}, (res) => {
      that.setData({ columns: res.data });
    })
  },
  // 确定添加
  onSave() {
    var regIdNo = /^(13[0-9]|14[4579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    if (this.data.columns == "") {
      Toast('请选择银行卡');
    } else if (this.data.bankNo.toString().length < 15 || this.data.bankNo.toString().length > 24) {
      Toast('请输入正确银行卡号');
    } else if (!regIdNo.test(this.data.phone)) {
      Toast('请输入正确的手机号码');
    } else {
      app.func.reqpost('/xcx/account/addUserBank', { bankNo: this.data.bankNo, bankId: this.data.bankId, phone: this.data.phone }, (res) => {
        if (data.code === 'ok') {
          wx.navigateBack({
            data:1
          })
        } else {
          Toast(data.message)
        }
      })
    }
  },
  onShow: function () {

  },
})