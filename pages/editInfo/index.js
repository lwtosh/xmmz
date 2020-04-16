var app = getApp();
import Toast from '../../dist/toast/toast';
Page({
  data: {
    userInfo:{},
    showUser:false,
    nickName:'',
    flag:false,
    sex: '',
    sexId:'',
    columns: [{ text: '女', id: 2 }, { text: '男', id: 1 }],
  },
  onLoad: function (options) {
    app.func.reqget('/xcx/user/fetchTinyUser', {}, (res) => {
      if (res.code == 'ok') {
        this.setData({ avatar: res.data.avatar, nickName: res.data.nickName, id: res.data.id})
        if (res.data.sex == 1){
          this.setData({ sex: '男' })
        } else if (res.data.sex == 2){
          this.setData({ sex: '女' })
        }
      }
    })
  },
  // 输入用户名
  onClickName() { this.setData({ showUser: true})},
  onsexe() { this.setData({ flag: true }) },
  onClose() { this.setData({ showUser: false }) },
  onCancel() { this.setData({ flag: false })},
  onConfirm(event) {
    const { picker, value, index } = event.detail
    this.setData({ sex: event.detail.value.text, sexId: event.detail.value.id, flag: false })
  },
  // 上传头像
  chooseImage() {
    var that = this;
    wx.chooseImage({
    success: function (res) {
      const imgsrc = res.tempFilePaths[0];
      const host = 'https://img-xmmz.oss-cn-hangzhou.aliyuncs.com'
    app.func.reqget('/xcx/auth/getAliStsRole', {}, (res) => {
      const aliyunFileKey = res.data.dir + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
      if (res.code == 'ok') {
        wx.uploadFile({
          url: host,
          filePath: imgsrc,
          name: 'file',
          formData: {
            'name': imgsrc,
            'Key': aliyunFileKey,
            'OSSAccessKeyId': res.data.accessid,
            'policy': res.data.policy,
            'signature': res.data.signature,
            'success_action_status': '200'
          },
          success(res) {
            var aer = host +'/'+ aliyunFileKey
            that.setData({ avatar: aer })
          },
        })
      }
    })
    }
    })
  },
  
  onSave(){
    if (this.data.nickName == "") {
      Toast('请填写您的姓名！')
    }else{
      app.func.reqpost('/xcx/user/updateUser', {sex: this.data.sexId, nickname: this.data.nickName, avatar: this.data.avatar}, (res) => {
        if (res.code == 'ok') {
          Toast('信息修改成功')
          wx.navigateBack({
            data: 1
          })
        }
      })
    }
  },
  onconfirm() { this.setData({ nickName: this.data.nickName1 })},
  onChange(e) { this.setData({ nickName1: e.detail })},
  onShow: function () {
  }
})