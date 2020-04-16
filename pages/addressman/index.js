var app = getApp();
Page({
  data: {
    dataList: [],
    current: '',
    check: 0,
    items: []
  },
  handleChange({
    detail = {}
  }) {
    this.setData({
      current: detail.value
    });
  },
  address() {
    wx.navigateTo({
      url: '../addOreidt/index'
    })
  },
  handleChangeAddress(e) {
    var that = this
    that.setData({
      check: 1,
    });
    var item = JSON.stringify(e.currentTarget.dataset.item)
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    var prevPage = pages[pages.length - 2];
    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      item: JSON.stringify(e.currentTarget.dataset.item)
    })
    prevPage.onShow();
    wx.navigateBack({
      delta: 1
    })
  },
  handeList() {
    var that = this
    if (this.options.id !== '') {
      app.func.reqget('/xcx/user/fetchUserAddressList', {
        'uid': wx.getStorageSync('uid')
      }, (res) => {

        that.setData({
          dataList: res.data,
        })
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].isDefault == 1) {
            that.setData({
              checked: true,
            });
          }
        }
      })
    } else {
      app.func.reqget('/xcx/user/fetchUserAddressList', {
        'uid': wx.getStorageSync('uid')
      }, (res) => {
        that.setData({
          dataList: res.data
        })
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].isDefault == 1) {
            that.setData({
              current: detail.value,
              checked: true,
            });
          }
        }
      })
    }

  },
  onLoad: function(options) {
    this.handeList()
  },
  onShow() {
    this.onLoad()
  },
})