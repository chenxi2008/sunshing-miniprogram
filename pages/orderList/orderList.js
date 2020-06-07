//index.js
//获取应用实例
const app = getApp()
const obj = {
  'padding': '待审核',
  'confirm': '已确认',
  'success': '已完成',
  'cancel': '已取消',
  'fail': '失败'
}
Page({
  data: {
    userInfo: {},
    orderList: [],
    orderList1: [],
    orderList2: [],
    orderList3: [],
    tabIndex: 1,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  changeTap: function(e) {
    let {currentTarget} = e
    this.setData({
      tabIndex: currentTarget.dataset.id
    })
  },
  handleCancel: function(e) {
    let {currentTarget:{dataset:{id}}} = e
    console.log(JSON.stringify(e))
    if (id) {
      wx.showModal({
        title: '提示',
        content: '您确认要取消该活动吗?',
        success: res => {
          if (!res.cancel) {
            wx.request({
              url: app.globalData.baseUrl+ '/order/changeState',
              data: {
                id: id,
                state: 'cancel',
              },
              success: res => {
                res = res.data
                wx.showToast({
                  title: res.code == 200 ? '成功' : '失败',
                  icon: res.code == 200 ? 'success' : 'fail',
                  duration: 2000
                })
                if (res.code == 200) {
                  setTimeout(() =>{
                    this.initData()
                  }, 2000)
                }
              }
            })
          }
        }
      })

    }
  },
  initData: function() {
    let openid = app.globalData.openid
    wx.request({
      url: app.globalData.baseUrl+'/user/getOrderList',
      data: {
        openid
      },
      success: res => {
        if (res.data.code == 200) {
          this.orderList = res.data.data.map(item => {
            let date = new Date(new Date(item.createtime).getTime()+24*60*60*1000)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            date = date.getDate()
            item.begintime = year+'-'+ month +'-'+ date +'  '+ item.begintime
            item.statename = obj[item.state]
            item.tempId = item.equipmentid == 16 ? '' : item.equipmentid
            return item
          })

          this.setData({
            orderList: this.orderList,
            orderList1: this.orderList.filter(item => {
              return !!~['padding','confirm'].indexOf(item.state)
            }),
            orderList2: this.orderList.filter(item => {
              return !!~['success'].indexOf(item.state)
            }),
            orderList3: this.orderList.filter(item => {
              return !!~['cancel','fail'].indexOf(item.state)
            })
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg || '网络错误',
            showCancel: false
          })
        }
      }
    })
  },
  navigetTo(e) {
    let {currentTarget:{dataset:{id,type}}} = e
    wx.navigateTo({
      url: `/pages/resoult/resoult?type=${type}&id=${id}`
    })
  },
  onLoad: function (query) {
    if (query.type) {
      this.setData({
        tabIndex: query.type
      })
    }
    this.initData()
  },

})
