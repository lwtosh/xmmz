// // custom-tab-bar/index.js
// pages/componentNavBar/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    homeActive: {
      type: Boolean,
      value: false
    },
    exploreActive: {
      type: Boolean,
      value: false
    },
    userActive: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回首页
    goHome: function (e) {
      wx.switchTab({
        url: '../home/index',
      })
    },
    // 返回发现页 
    goExplore: function (e) {
      wx.switchTab({
        url: '../explore/explore',
      })
    },
    // 返回我的页面
    goUser: function (e) {
      wx.switchTab({
        url: '../user/user',
      })
    },
    showCode: function (e) {
      console.log(e);
      let that = this;
      console.log(that.data);
    }
  }
})

// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {
//   },
//   /**
//    * 组件的初始数据
//    */
//   data: {
//     selected: 0,
//     list: [{
//       pagePath: "../../assets/tab1.png",
//       iconPath: "../../assets/tab1Active.png",
//       text: "仙美首页",
//       "pagePath": "/pages/home/index"
//     }, {
//         pagePath: "../../assets/tab2.png",
//         iconPath: "../../assets/tab2Active.png",
//         text: "全部产品",
//         "pagePath": "/pages/shop/index"
//     }, {
//         pagePath: "../../assets/tab3.png",
//         iconPath: "../../assets/tab3Active.png",
//         text: "店主中心",
//         "pagePath": "/pages/shopkeeperCenter/index"
//     }, {
//         pagePath: "../../assets/tab4.png",
//         iconPath: "../../assets/tab4Active.png",
//         text: "购物车",
//         "pagePath": "/pages/cart/index"
//       }, {
//         pagePath: "../../assets/tab5.png",
//         iconPath: "../../assets/tab5Active.png",
//         text: "个人中心",
//         pagePath: "/pages/my/index"
//       }]
//   },
  
//   /**
//    * 组件的方法列表
//    */
//   methods: {
//     onChange(value) {
//       console.log(value)
//       console.log(this.data.list[value.detail])
//       let url = this.data.list[value.detail].pagePath;
//       wx.switchTab({ url});
//       this.setData({
//         selected: value.detail
//       })
//     }
//   }
// })
