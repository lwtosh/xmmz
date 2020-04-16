var app = getApp();
Page({
  data: {
    show: false,
    listRadio: [{ name: '换货', id: '2' }, { name: '退款', id: '3' }, { name: '退货退款', id: '1' }],
    radio:''
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onChange(event) {
    this.setData({ radio: event.detail});
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({radio: name});
  },
  onclick1(){
    if (this.data.radio === ''){
      this.Toast('请选择退款类型')
    }
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})