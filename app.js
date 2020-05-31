//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  },
  onShow: function() {
    
    // 获取用户信息
    let openid = wx.getStorageSync('openid')
    let userInfo = wx.getStorageSync('userInfo');
    
    (openid) && (this.globalData.openid = openid)

    if (userInfo) {
      this.globalData.isAuth = true
      this.globalData.userInfo = userInfo
    } else {
      //如果获取过openid就不再请求
      if (openid) return
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                this.globalData.isAuth = true
                wx.setStorageSync('userInfo', res.userInfo)
              }
            })
            this.globalData.isAuth = true
          } else {
            //没有授权触发登录接口
            wx.login({
              success: res => {
                let {code} = res
                wx.request({
                  url: this.globalData.baseUrl + '/auth',
                  data: {
                    js_code: code
                  },
                  method: 'GET',
                  success: res => {
                    if (res.data.code > 201) {
                      wx.showModal({
                        title: '提示',
                        content: '网络错误请稍后重试！',
                        success(res) {}
                      })
                    } else {
                      let openid = res.data.data.openid
                      this.globalData.openid = openid
                      wx.setStorageSync('openid', openid)
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  },
  globalData: {
    openid: null,
    userInfo: null,
    isAuth: false, //用户是否授权
    baseUrl: 'http://127.0.0.1:7001'
  }
})