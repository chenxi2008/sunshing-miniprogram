//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    scrollText: ['请提前一天预约当天的活动','做好个人防护和运动安全哦'],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  onLoad: function () {
    
  },
  redirectTo({currentTarget:{dataset}}) {
    if (dataset.type) {
      wx.navigateTo({
        url: '/pages/appointment/appointment?type='+ dataset.type
      })
    }
  }
})
