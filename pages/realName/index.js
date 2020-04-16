var app = getApp()
import Toast from '../../dist/toast/toast';
Page({
  data: {
    name: '',
    idcard:'',
    disabled:false,
  },
  onLoad: function (options) {
    app.func.reqget('/xcx/user/fetchUserCertInfo', {}, (res) => {
      if (res.code == 'ok' && res.data){
        this.setData({
          name: res.data.name,
          idcard: res.data.idcard,
          disabled: true
        })
      }
    })
  },
  onClickChang1(e){
    this.setData({ name: e.detail})
  },
  onClickChang2(e) {
    this.setData({ idcard: e.detail })
  },
  onSave(){
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (this.data.name == ''){
      Toast('请填写您的名字')
    } else if (!regIdNo.test(this.data.idcard)){
      Toast('请输入正确的身份证号')
    }else{
      app.func.reqpost('/xcx/user/saveUserCert', { name: this.data.name, idcard: this.data.idcard, payMethod:'WXGZH'}, (res) => {
        if (res.code == 'ok') {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(res) {
              Toast('认证成功')
              wx.navigateBack({
                data: 1
              })
            },
            complete(res) { },
            fail(res) {
            }
          })}else{
          Toast(res.message)
        }
      })
    }
  },
  // weixin() {
  //   app.func.reqpost('/xcx/order/payOrder', { orderId: res.data.orderId, payMethod: 'WXGZH'}, (res) => {
     
  //     } else {
  //       Toast(res.message)
  //     }
  //   })
  //   // setTimeout(() => { this.setData({ disabled: false }) }, 3000)
  // },
  onShow: function () {

  }
})