const app = getApp();
Page({
  data: {
    navH:0,
    active:false,
    hidden: true,
    dataList:{}
  },
  onClickLeft() {
    if (this.data.active){
      wx.switchTab({
      url: '../home/index',
    })
    }else{
      wx.navigateBack({
        delta: 1
      });
    }
  },
  onLoad: function(options) {
    app.func.reqget('/xcx/user/fetchMyInviteInfo', {}, (res) => {
      if (res.code === 'ok') {
        this.setData({
          dataList: res.data,
        })
        wx.setStorageSync('qrcode', res.data.qrcode)
      }
    })
    this.setData({
      navH: app.globalData.navHeight
    })
    var page =getCurrentPages()
    if (page.length <= 1){
      this.setData({ active:true})
    }
    var promise1 = new Promise(function (resolve, reject) {
      /* 获得要在画布上绘制的图片 */
      wx.getImageInfo({
        src: wx.getStorageSync('qrcode'),
        success: function (res) {
          // console.log(res)
          resolve(res);
        }
      })
    })
      let promise2 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: 'https://img-xmmz.oss-cn-hangzhou.aliyuncs.com/code2.png',
          success: function (res) {
            // console.log(res)
            resolve(res);
          }
        })
      })
    let promise3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../assets/logo.png',
        success: function (res) {
          // console.log(res)
          resolve(res);
        }
      })
    })
      /* 图片获取成功才执行后续代码 */
      Promise.all(
        [promise1, promise2, promise3]
      ).then(res => {
        // console.log(res)
        /* 创建 canvas 画布 */
        const ctx = wx.createCanvasContext('shareImg')
        /* 绘制图像到画布  图片的位置你自己计算好就行 参数的含义看文档 */
        /* ps: 网络图片的话 就不用加../../路径了 反正我这里路径得加 */
        ctx.drawImage(res[1].path, 0, 0, 545, 771)
        ctx.drawImage(res[0].path, 128, 80, 300, 300)
        ctx.strokeRect(238, 180,2, 2);
        ctx.drawImage('../../'+res[2].path, 238, 180, 80, 80)
        /* 绘制文字 位置自己计算 参数自己看文档 */
        ctx.setTextAlign('center')
        ctx.setFillStyle('#fff')
        ctx.font = 'normal bold 28rpx sans-serif'
        ctx.fillText('仙美美妆小程序', 545 / 2, 570)
        ctx.font = 'normal normal 24px sans-serif';
        ctx.setTextAlign('center')
        ctx.setFillStyle('#fff')
        ctx.fillText('长按预览或发送', 545 / 2, 620)
        /* 绘制 */
        ctx.stroke()
        ctx.draw()
      })
    
  },
  onclick(){
    wx.previewImage({
      current: this.data.prurl,
      urls: [this.data.prurl]
    })
  },
  share(){
    wx.showLoading({
      title: '图片生成中，请稍等',
    })
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function (res) {
        wx.hideLoading();
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
      },
      fail: function (res) {
        that.setData({ hidden: true})
      }
    })
  },
  coles() { this.setData({ hidden: true })},
  save(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，快去分享吧！',
          showCancel: false,
          confirmText: '好的呢',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })
  },
   onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
     return {
       title: '我的邀请码',
       imageUrl: '', //图片地址
       path: '/pages/code/index', // 用户点击首先进入的当前页面
       success: function (res) { },
       fail: function (res) { }
     }
  }
})