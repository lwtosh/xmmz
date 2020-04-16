var app = getApp();
Page({
  data: {
    currentWordNumber:'0',
    fileList:[]
  },
  //字数限制  
  inputs: function (e) {
    var value = e.detail.value;
    var len = parseInt(value.length);
     if (len > 1)
    this.setData({
      currentWordNumber: len
    });
    if (len > 300) return;
  },
  onSave(){},
  onLoad: function (options) {

  }
})