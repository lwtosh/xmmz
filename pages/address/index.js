var app = getApp();
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    addInfo: [],
  },
  onLoad: function (options) {
    app.func.reqget('/xcx/user/fetchUserAddressList', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({ addInfo: res.data})
      } else {
        Toast(res.message)
      }
    })
  },
  // 设为默认
  onClickDetail(e){
    app.func.reqpost('/xcx/user/updateUserAddressDefault', { id: e.currentTarget.dataset.id,isDefault:1}, (res) => {
      if (res.code == 'ok') {
        this.onLoad()
      } else {
        Toast(res.message)
      }
    })
  },
  // 编辑
  onClickEidt(e) {
    wx.navigateTo({
      url: '../addOreidt/index?id=' + e.currentTarget.dataset.id
    }) 
  },
  // 删除
  onClickDel(e) {
    // var that = this
    Dialog.confirm({
      title: '温馨提示',
      message: '确定要删除该地址吗',
      confirmButtonColor: '#EF8D06'
    }).then(() => {
      app.func.reqpost('/xcx/user/delUserAddress', { id: e.currentTarget.dataset.id }, (res) => {
        if (res.code == 'ok') {
          this.onLoad()
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
  // 新增地址
  address() {
    wx.navigateTo({
      url: '../addOreidt/index'
    })
  },
  onShow() { //返回显示页面状态函数
    this.onLoad()
  }
})