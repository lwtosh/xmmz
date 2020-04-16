var app = getApp()
Page({
  data: {
    value: '',
    historyList: []
  },
  onChange(e) {
    this.setData({
      value: e.detail
    });
  },
  onSearch() {
    wx.navigateTo({
      url: '../ssList/index?text=' + this.data.value
    })
    this.setData({
        historyList: this.unique(this.data.historyList.concat(this.data.value))
    })
    wx.setStorageSync('historyList', this.data.historyList)
  },
  unique(arr) {
    return arr.filter(function (item, index, arr) {
      return arr.indexOf(item, 0) === index;
    });
  },
  onCLickDel() {
    this.setData({
      historyList: []
    })
    wx.removeStorageSync('historyList')
  },
  // onClick() {
  //   wx.navigateTo({
  //     url: '../ssList/index?text=' + this.data.value
  //   })
  //   this.setData({
  //     historyList: this.data.historyList.concat(this.data.value)
  //   });
  //   wx.setStorageSync({ key: 'historyList', data: new Set(this.data.historyList) })
  // },
  onClickSeach(e){
    wx.navigateTo({
      url: '../ssList/index?text=' + e.currentTarget.dataset.text
    })
  },
  onLoad: function(options) {
    if (wx.getStorageSync('historyList')){
      this.setData({
        historyList: wx.getStorageSync('historyList')
      });
    }
  }
})