var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    region: ['请选择省市区'],
    addressInfo: null,
    checked:false,
    id: '',
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  formSubmit(e) {
    var that = this
    if (that.data.addressInfo == null) {
      if (e.detail.value.consignee == "") {
        Toast('请填写您的姓名！')
      } else if (!(/^1(3|6|9|4|5|7|8)\d{9}$/.test(e.detail.value.phone))) {
        Toast('手机号格式不正确~')
      } else if (e.detail.value.region == 0) {
        Toast('请选择您的所在区域~')
      } else if (e.detail.value.postcode === undefined) {
        Toast('邮政编号没有填哦~');
      } else if (e.detail.value.address == "") {
        Toast('请输入您的详细地址~');
      } else {
        var that = this
        //保存新地址
        app.func.reqpost('/xcx/user/addUserAddress?consignee=' + e.detail.value.consignee + '&province=' + e.detail.value.region[0] + '&city=' + e.detail.value.region[1] + '&county=' + e.detail.value.region[2] + '&phone=' + e.detail.value.phone + '&address=' + e.detail.value.address + '&isDefault=' + (that.data.checked == true? 1 : 0) + '&postcode=' + e.detail.value.postcode + '&uid=' + wx.getStorageSync('uid'), {
        }, (res) => {
          if (res.code = "ok") {
          Toast('添加地址成功')
            setTimeout(function () {
              wx.navigateBack({
                data: 1
              })
            }, 2000);
          } else {
            Toast(res.message);
          }
        })
      }
    } else {
      if (e.detail.value.consignee == "") {
        Toast({
          content: '请填写您的姓名！',
        });
      } else if (!(/^1(3|6|9|4|5|7|8)\d{9}$/.test(e.detail.value.phone))) {
        Toast({
          content: '手机号格式不正确~',
        });
      } else if (e.detail.value.region == 0) {
        Toast({
          content: '请选择您的所在区域~',
        });
      } else if (e.detail.value.postcode === undefined) {
        Toast({
          content: '邮政编号没有填哦~',
        });
      } else if (e.detail.value.address == "") {
        Toast({
          content: '请输入您的详细地址~',
        });
      } else {
        var that = this
        //保存新地址
        app.func.reqpost('/xcx/user/updateUserAddress?id=' + that.data.addressInfo.id + '&consignee=' + e.detail.value.consignee + '&province=' + e.detail.value.region[0] + '&city=' + e.detail.value.region[1] + '&county=' + e.detail.value.region[2] + '&phone=' + e.detail.value.phone + '&address=' + e.detail.value.address + '&isDefault=' + (that.data.checked == true ? 1 : 0)+ '&postcode=' + e.detail.value.postcode + '&uid=' + wx.getStorageSync('uid'), {
        }, (res) => {
          if (res.code = "ok") {
            Toast( '修改成功');
            setTimeout(function () {
              wx.navigateBack({
                data: 1
              })
            }, 1000);
          } else {
            Toast(res.message)
          }
        })
      }
    }

  },
  adderss() {
    var that = this
    app.func.reqget('/xcx/user/fetchUserAddressList', {
      'uid': wx.getStorageSync('uid')
    }, (res) => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].id == that.options.id) {
          that.setData({
            addressInfo: res.data[i],
            region: [res.data[i].province, res.data[i].city, res.data[i].county]
          })
          if (res.data[i].isDefault == 1){
            that.setData({ checked: true });
          }
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    if (options.id) {
      this.adderss()
    }
  },
  onReady: function () {

  },
  onShow: function () {
  },
})